const json = {
  uniqueAPICallIdentifier: 0,
  body: {
    pageOffset: '0',
    count: 5,
    feedbackID: 27233,
    currentSegment: 'Main Segment',
    currentSegmentID: 191074,
    segments: [
      {
        parentSegmentID: null,
        segmentID: 191074,
        segmentName: 'Main Segment',
        segmentCode: 'S1',
        owners: [
          {
            ownerName: 'Mehedi Hasan',
            ownerID: 220520,
          },
        ],
        segments: [
          {
            parentSegmentID: 191074,
            segmentID: 211423,
            segmentName: 'Office',
            segmentCode: 'S2',
            owners: [
              {
                ownerName: 'Mehedi Hasan',
                ownerID: 220520,
              },
            ],
          },
          {
            parentSegmentID: 191074,
            segmentID: 211424,
            segmentName: 'Home',
            segmentCode: 'S3',
            owners: [
              {
                ownerName: 'Mehedi Hasan',
                ownerID: 220520,
              },
            ],
          },
        ],
      },
    ],
  },
  statusCode: 200,
};

// segments: [
//     {
//       segmentID: 191074,
//       segmentName: 'Main Segment',
//       segmentCode: 'S1',
//       owners: [
//         {
//           ownerName: 'Mehedi Hasan',
//           ownerID: 220520,
//         },
//       ],
//     },
//   ],
