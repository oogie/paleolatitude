import { helpers } from "../stdimports.js";

export const apiHelpers = {

    getPaleolatitude: function paleolatitude(location) {
        let lat = location.coord.lat;
        let lon = location.coord.lon;
        let age = location.age || -1;
        let minAge = location.minAge || 0;
        let maxAge = location.maxAge || 9999;
        let refFrame = location.refFrame || helpers.sessionStorage.getOption("paleomagneticReferenceFrame");

        return safeFetch("paleolatitude", [lat, lon, age, minAge, maxAge, refFrame])
    },

    getIPLocation: function IPLocation() {
        return safeFetch("iplocation", [])
    }

}

function safeFetch(command, params) {
    return new Promise((resolve, reject) => {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            fetch(`${window.envconfig.domain}api/${command}/${params.join("/")}`, { signal: controller.signal /* maybe use: AbortSignal.timeout(15000) */ })
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 422) { //an 'expected' error, the error message from the calculation server is included in the message
                            return response.text().then((error) => {
                                //This proposes solution wil never work because of the way the calculation engine is used, remove this part of the message.
                                error = error.replace("Maybe try computing for all ages?", "");

                                reject(error)
                            })
                        }
                        else if (response.status >= 503) {
                            reject(`Calculation server is not running at the moment, please try again later. If persists please contact the owner of ${window.envconfig.domain}`)
                        }
                        else if (response.status >= 500) {
                            reject(`Internal error in the calculation server, please try again later. If persists please contact the owner of ${window.envconfig.domain}`)
                        }
                        else {
                            console.log(response);
                            reject(`Unknown networking or calculation error, please try again later. If persists please contact the owner of ${window.envconfig.domain}`)
                        }
                        return;
                    }
                    return response.json();
                })
                .then((data) => {
                    resolve(data)
                })
                .catch((error) => {
                    console.log(error);
                    reject(`Networking error, please check your internet connection.`);
                }).finally(() => {
                    clearTimeout(timeoutId);
                });
        }
        catch (error) {
            console.log(error);
            reject(`Networking error, please check your internet connection.`);
        }
    })
}
