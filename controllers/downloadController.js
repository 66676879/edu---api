const path = require('path');

exports.downloadFile = (req, res) => {
  const file = path.join(__dirname, '..', 'files', 'EDU VERSE.zip'); // Update with your file path
  res.download(file, (err) => {
    if (err) {
      //console.error('Error downloading EDU VERSE destop app:', err);
      res.status(500).send('Error downloading EDU VERSE destop app');
    }
  });
};
