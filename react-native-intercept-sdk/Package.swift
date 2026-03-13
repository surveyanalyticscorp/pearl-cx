// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "ReactNativeSurveyIntercept",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "ReactNativeSurveyIntercept",
            targets: ["ReactNativeSurveyIntercept"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/surveyanalyticscorp/ios-cx.git", from: "2.2.7")
    ],
    targets: [
        .target(
            name: "ReactNativeSurveyIntercept",
            dependencies: [
                .product(name: "QuestionProCXFramework", package: "ios-cx")
            ],
            path: "ios"
        )
    ]
)