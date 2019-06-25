	/**
	
   * Get public URL of a file. The file must have public access
	
   * @param {string} bucketName
	
   * @param {string} fileName
	
   * @return {string}
	
   */

	exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;