// react-native.config.js
module.exports = {
    dependency: {
      platforms: {
        android: {
          packageImportPath: 'import com.speechtotextinputwrapper.SpeechToTextPackage;',
          packageInstance: 'new SpeechToTextPackage()',
        },
      },
    },
  };