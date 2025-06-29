A simple weather app capable of using Parameter Manager & Secret Manager as a source of truth for its API Key & other relevant configurations.

# Steps to run this application

`git clone https://github.com/underscoreanuj/parameter-manager-weather-app.git`

Signup for a free API key from: https://home.openweathermap.org/

## Inside your GCP project

1. Open Secret Manager & store the weather API key there. Copy the resource identifier for the Secret Version you created. It would look something like: `projects/<your-project-id>/secrets/<secret-name>/versions/<version-id>`

2. Open Parameter Manager & create a YAML type Parameter.

3. Navigate to the Parameter you created & open its `Overview` section. Copy the `IAM Principal Identifier` & grant it the `Secret Manager Secret Accessor` permission on the Secret you created containing the API key.

4. Then add a Parameter Version inside it with the following content:

```
version: 'v1'
apiKey: '__REF__(//secretmanager.googleapis.com/projects/<your-project-id>/secrets/<secret-name>/versions/<version-id>)'
fahrenheit: false
defaultLocation: 'London'
showHumidity: false
# dummy values, useful when the app is not connected to internet after going live & loading this config or when the weather API is down
dummyData:
- 
    city: 'London'
    temperature: '15°C'
    description: 'Partly Cloudy'
    humidity: '70%'
    windSpeed: '10 km/h'
    icon: 'http://openweathermap.org/img/wn/02d@2x.png'
- 
    city: 'New York'
    temperature: '22°C'
    description: 'Sunny'
    humidity: '55%'
    windSpeed: '12 km/h'
    icon: 'http://openweathermap.org/img/wn/03d@2x.png'
-
    city: 'Tokyo'
    temperature: '28°C'
    description: 'Clear Sky'
    humidity: '60%'
    windSpeed: '8 km/h'
    icon: 'http://openweathermap.org/img/wn/04n@2x.png'
-
    city: 'Paris'
    temperature: '18°C'
    description: 'Light Rain'
    humidity: '85%'
    windSpeed: '15 km/h'
    icon: 'http://openweathermap.org/img/wn/04d@2x.png'
-
    city: 'Sydney'
    temperature: '20°C'
    description: 'Mostly Sunny'
    humidity: '65%'
    windSpeed: '9 km/h'
    icon: 'http://openweathermap.org/img/wn/04n@2x.png'
```

5. Once created attemp to `Render` the Parameter Version & verify that your Rendered output has your weather API key substituted properly.
6. Edit `parameter-manager-weather-app/weather-backend/server.js` file:
  - `startupConfigProject` with the project ID of the parameter.
  - `startupConfigLocation` with the location of the parameter.
  - `startupConfigParameter` with the name of the parameter.
  - `appVersion` with the name of the parameter version containing the YAML data.


## In First Shell:

`cd parameter-manager-weather-app/weather-backend`

`gcloud auth application-default login`

`node server.js`

## In Second Shell:


`cd parameter-manager-weather-app`

`npm start`


## How it looks

![home screen](sample-app-main-view.png?raw=true)

![weather view](sample-app-weather-view.png?raw=true)




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
