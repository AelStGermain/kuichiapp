// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Firebase configuration
  firebase: {
    apiKey: "AIzaSyCG6xrRUKtBYiBMWqIzFyPieQLb2Co1BPI",
    authDomain: "kuichi.firebaseapp.com",
    projectId: "kuichi",
    storageBucket: "kuichi.firebasestorage.app",
    messagingSenderId: "323891971524",
    appId: "1:323891971524:web:3ef9747ad72c9df92a9091"
  },
  // Backend API configuration (Spring Boot)
  apiUrl: 'http://localhost:8080/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
