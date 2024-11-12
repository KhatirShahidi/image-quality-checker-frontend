const cv = require('opencv-bindings');

/**
 * Function to check if an image is blurry using the Laplacian variance method.
 * @param {Buffer} imageBuffer - The image buffer
 * @returns {boolean} - Returns true if the image is blurry, false otherwise
 */
function isImageBlurry(imageBuffer) {
  try {
    // Decode the image from buffer
    const image = cv.imdecode(imageBuffer);

    // Convert the image to grayscale
    const grayImage = image.cvtColor(cv.COLOR_BGR2GRAY);

    // Apply Laplacian filter
    const laplacian = grayImage.laplacian(cv.CV_64F);

    // Compute the variance of the Laplacian
    const meanStdDev = laplacian.meanStdDev();
    const variance = meanStdDev.stddev[0] ** 2;

    // Define a threshold; if the variance is below this, consider the image blurry
    const threshold = 100.0;
    return variance < threshold;
  } catch (error) {
    console.error('Error in blur detection:', error);
    return true; // Assume the image is blurry if there's an error
  }
}

module.exports = { isImageBlurry };
