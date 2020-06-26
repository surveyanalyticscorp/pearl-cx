//
//  SocialSignInViewController.swift
//  ios
//
//  Created by Jignesh on 17/04/17.
//  Copyright © 2017 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import GoogleSignIn

let kButtonCornerRadious  =  4


class SocialSignInViewController: UIViewController, GIDSignInDelegate, AuthenticateServiceDelegate {
 
    @IBOutlet weak var iGIDSignInButton: UIButton!
    @IBOutlet weak var iSlackSignInButton: UIButton!
    @IBOutlet weak var iOfficeSignInButton : UIButton!
    @IBOutlet weak var iSignInButton: UIButton!
    
    @IBOutlet weak var iGIDSignInImage: UIImageView!
    @IBOutlet weak var iSlackSignInImage: UIImageView!
    @IBOutlet weak var iOfficeSignInImage : UIImageView!
    
    var baseController = Office365ClientFetcher()
    var oauthswift: OAuthSwift?
    var iDelegate: MainViewDelegate?
    
    lazy private var activityIndicator : CustomActivityIndicatorView = {
        let image : UIImage = UIImage(named: "Loading")!
        return CustomActivityIndicatorView(image: image)
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(){
            if let isGoogleIntegrationEnable = appDetailsDict["isGoogleIntegrationEnable"] as? Bool, isGoogleIntegrationEnable {
                GIDSignIn.sharedInstance().delegate = self
                GIDSignIn.sharedInstance().presentingViewController = self
                // Initialize sign-in
                if let googleClientID = appDetailsDict["kGoogleClientID"] as? String {
                    GIDSignIn.sharedInstance().clientID = googleClientID
                }
                if let googleLoginURL = appDetailsDict["kGoogleClientID"] as? String {
                    GIDSignIn.sharedInstance().clientID = googleLoginURL
                }
            }else{
                self.iGIDSignInButton.isHidden = true
            }
            if let isSlackntegrationEnable = appDetailsDict["isSlackntegrationEnable"] as? Bool, !isSlackntegrationEnable{
                self.iSlackSignInButton.isHidden = true
            }
            if let isOfficeIntegrationEnable = appDetailsDict["isOfficeIntegrationEnable"] as? Bool, !isOfficeIntegrationEnable {
                self.iOfficeSignInButton.isHidden = true
            }
        }
        self.iSignInButton?.underlineButton(text: (self.iSignInButton?.titleLabel?.text)!)
    }
    
    override func viewWillLayoutSubviews() {
        
        self.iGIDSignInImage.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft,.bottomLeft])
        self.iGIDSignInButton.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft, .topRight, .bottomLeft, .bottomRight])
        
        self.iSlackSignInImage.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft,.bottomLeft])
        self.iSlackSignInButton.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft, .topRight, .bottomLeft, .bottomRight])
        
        self.iOfficeSignInImage.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft,.bottomLeft])
        self.iOfficeSignInButton.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft, .topRight, .bottomLeft, .bottomRight])
        
        self.iSignInButton.roundCornersWithLayerMask(cornerRadii: CGFloat(kButtonCornerRadious), corners: [.topLeft, .topRight, .bottomLeft, .bottomRight])
    }
    
    override func viewDidAppear(_ animated: Bool) {
            self.addLoadingIndicator()
            self.hideActivityIndicator()
    }
    
    func addLoadingIndicator () {
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
    }

    
    @IBAction func backButtonClicked(_ sender: Any) {
        self.navigationController?.popViewController(animated: true)
    }
    
    @IBAction func signInClicked(_ sender: Any) {
         self.pushLoginViewFromSocialSignInViewController()
    }
    
    @IBAction func googleSignInClicked(_ sender: Any) {
        self.showActivityIndicator()
        GIDSignIn.sharedInstance().signIn()
    }
    
    @IBAction func slackSignInClicked(_ sender: Any) {
        if  let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let consumerKey = appDetailsDict["kConsumerKey"] as? String,
            let consumerSecretKey = appDetailsDict["kConsumerSecretKey"] as? String {
            self.doOAuthSlack(consumerKey: consumerKey, consumerSecreat: consumerSecretKey)
        }
    }
    
    @IBAction func office365SignInClicked(_ sender: Any) {
        self.showActivityIndicator()
        let authenticationManager:AuthenticationManager = AuthenticationManager.sharedInstance
        authenticationManager.clearCredentials()
        connectToOffice365()
    }
 
    func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
        if let errorObj = error  {
            print("google+ integration error description = \(errorObj.localizedDescription)")
            self.hideActivityIndicator()
        }else{
            self.hideActivityIndicator()
            if let hostDomain = user.hostedDomain,
                let profileemail = user.profile.email{
                self.checkAuthentication(aEmailID: profileemail, aPassword: "", aAccessCode: hostDomain, aSourceMode: "google")
            }
            // signout from google account.
            GIDSignIn.sharedInstance().signOut()
        }
    }
    
    // MARK: Slack Login
    func doOAuthSlack(consumerKey : String, consumerSecreat : String){
        let oauthswift = OAuth2Swift(
            consumerKey:  consumerKey,
            consumerSecret: consumerSecreat,
            authorizeUrl:   kSlackAuthorizeUrl,
            accessTokenUrl: kSlackAccessTokenUrl,
            responseType:   "code"
        )

        self.oauthswift = oauthswift
         oauthswift.authorizeURLHandler = getURLHandler()
        let state = generateState(withLength: 20)
        let _ = oauthswift.authorize(
            withCallbackURL: URL(string: "www.questionpro.com")!, scope: "identity.basic,identity.email", state: state,
            success: { credential, response, parameters in
                self.hideActivityIndicator()
                if !credential.oauth_id.isEmpty && credential.oauth_email.length > 0{
                    self.checkAuthentication(aEmailID: credential.oauth_email, aPassword: "", aAccessCode: credential.oauth_id, aSourceMode: "slack")
                }
        },
            failure: { error in
                print(error.localizedDescription, terminator: "")
                self.hideActivityIndicator()
        })
    }
    
    func getURLHandler() -> OAuthSwiftURLHandlerType {

        let internalWebViewController: WebViewController = {
            let controller = WebViewController()
            controller.view = UIView(frame: UIScreen.main.bounds) // needed if no nib or not loaded from storyboard
            controller.viewDidLoad()
            return controller
        }()
        self.addChildViewController(internalWebViewController)
        return internalWebViewController
    }
    
    func connectToOffice365() {
        // Connect to the service by discovering the service endpoints and authorizing
        // the application to access the user's email. This will store the user's
        // service URLs in a property list to be accessed when calls are made to the
        // service. This results in two calls: one to authenticate, and one to get the
        // URLs. ADAL will cache the access and refresh tokens so you won't need to
        // provide credentials unless you sign out.
        
        // Get the discovery client. First time this is ran you will be prompted
        // to provide your credentials which will authenticate you with the service.
        // The application will get an access token in the response.
        
        baseController.fetchDiscoveryClient { (discoveryClient) -> () in
            let servicesInfoFetcher = discoveryClient.getservices()

            // Call the Discovery Service and get back an array of service endpoint information
            let servicesTask = servicesInfoFetcher?.read(callback: { (serviceEndPointObjects:[Any]!, error:MSODataException!) in
                
                let serviceEndpoints = serviceEndPointObjects as! [MSDiscoveryServiceInfo]
                
                if (serviceEndpoints.count > 0) {
                    // Here is where we cache the service URLs returned by the Discovery Service. You may not
                    // need to call the Discovery Service again until either this cache is removed, or you
                    // get an error that indicates that the endpoint is no longer valid.
                    
                    var serviceEndpointLookup = NSMutableDictionary()
                    
                    for serviceEndpoint in serviceEndpoints {
                        serviceEndpointLookup[serviceEndpoint.capability] = serviceEndpoint.serviceEndpointUri
                    }
                    
                    // Keep track of the service endpoints in the user defaults
                    let userDefaults = UserDefaults.standard
                    userDefaults.set(serviceEndpointLookup, forKey: "O365ServiceEndpoints")
                    userDefaults.synchronize()
                    
                    DispatchQueue.main.async() {
                        self.hideActivityIndicator()
                        var tenantID = ""
                        var userEmail = ""
                        userEmail = userDefaults.string(forKey: "LogInUser")!
                        if  userDefaults.value(forKey: "LogInUserTID") != nil && userEmail.length > 0{
                            tenantID = userDefaults.value(forKey: "LogInUserTID") as! String
                            self.checkAuthentication(aEmailID: userEmail, aPassword: "", aAccessCode: tenantID, aSourceMode: "microsoft")
                        }
                    }
                }else {
                    DispatchQueue.main.async() {
                        self.hideActivityIndicator()
                        NSLog("Error in the authentication: %@", error)
                    }
                }
            })
            servicesTask?.resume()
        }
    }

    func showTokenAlert(name: String?, credential: OAuthSwiftCredential) {
         var message = "oauth_token:\(credential.oauthToken)"
        if !credential.oauthTokenSecret.isEmpty {
            message += "\n\noauth_toke_secret:\(credential.oauthTokenSecret)"
        }
        self.showAlertView(title: name ?? "Service", message: message)
    }

    func showAlertView(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Close", style: UIAlertActionStyle.default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
   
    func checkAuthentication(aEmailID:String, aPassword: String, aAccessCode: String, aSourceMode : String)  {
        self.showActivityIndicator()
        let authenticatConnection : Bool = WebServiceTXManager.invokeAuthenticateService(aDelegate: self, aEmailID:aEmailID, aPassword: aPassword, aAccessCode: aAccessCode, aSourceMode: aSourceMode)
        if !authenticatConnection {
            self.hideActivityIndicator()
        }
    }
    
    //MARK: - Delegate Methods, AuthenticateServiceDelegate
    func authenticateDidFinish(invocation: QPServiceAuthenticateInvocation) -> Void {
        GlobalData.setSocialSignInfoToUserDefault(key: kSocialSignInInfo, aSocialSignInEnable: true)
        self.hideActivityIndicator()
        self.iDelegate?.pushHomeViewFromMainViewController!()
    }
    
    func authenticateDidFinishWithError( error: String, invocation: QPServiceAuthenticateInvocation) -> Void {
        self.hideActivityIndicator()
        self.view.makeToast(error as String, duration: 3.0, position: .top)
    }

    func showActivityIndicator()   {
        activityIndicator.startAnimating()

    }
    
    func hideActivityIndicator()   {
        activityIndicator.stopAnimating()
    }
    
    func pushLoginViewFromSocialSignInViewController() -> Void {
         self.iDelegate?.pushLoginViewFromMainViewController!()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}

extension SocialSignInViewController : OAuthWebViewControllerDelegate {
    #if os(iOS) || os(tvOS)
    
    func oauthWebViewControllerDidPresent() {
        
    }
    func oauthWebViewControllerDidDismiss() {
        
    }
    #endif
    
    func oauthWebViewControllerWillAppear() {
        
    }
    func oauthWebViewControllerDidAppear() {
        
    }
    func oauthWebViewControllerWillDisappear() {
        
    }
    func oauthWebViewControllerDidDisappear() {
        // Ensure all listeners are removed if presented web view close
        oauthswift?.cancel()
    }
}

