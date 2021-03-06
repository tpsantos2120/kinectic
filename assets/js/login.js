/**
 * This is a jQuery function from the jQuery Form Validator
 * I have used to build form validation, for the login form,
 * it will post a HTTP request once submitted, and return status 400 if
 * user doesnt exist, then display error. If login is authenticated it will inform
 * the local storage of it. 
 */
setTimeout(() => {
    $(document).ready(function () {
        $("#loginForm").validate({
            onclick: false,
            errorClass: "uk-text-danger",
            validClass: "uk-text-success",
            messages: {
                userNameLogin: {
                    required: "Please enter your username."
                },
                passwordLogin: {
                    required: "Please enter your password."
                }
            },
            submitHandler: function (form, event) {
                event.preventDefault();
                const loginResponse = dispatchUserDetailsForAuthentication(form.userNameLogin.value, form.passwordLogin.value);
                loginResponse.then((element) => {
                    if (element.status === 400 || element.statusText === "Bad Request") {
                        console.log("Invalid Username or/and Password.", element);
                        const validator = $("#loginForm").validate();
                        validator.showErrors({
                            "userNameLogin": "Username and/or password incorrect.",
                            "passwordLogin": "Username and/or password incorrect."

                        });
                    } else {
                        storeUserDetailsLocally(element);

                    }
                })
            }
        });
    });
}, 300);

/**
 * Take the object conatining user details and save some of it locally for 
 * game use.
 * 
 * @param {Object} element 
 */
async function storeUserDetailsLocally(element) {
    console.log("Successfully received user details.", element)
    localStorage.setItem("firstname", element.user.firstname);
    localStorage.setItem("username", element.user.username);
    localStorage.setItem("id", element.user.id);
    localStorage.setItem("isAuthenticated", true);
    location.reload();
}

async function dispatchUserDetailsForAuthentication(userName, password) {
    const promiseResponse = await checkLoginDetailsExist(userName, password);
    return promiseResponse;
}

/**
 * Use HTTP request to check if user exist, then return error
 * or success.
 * 
 * @param {string} username 
 * @param {string} password 
 */
async function checkLoginDetailsExist(username, password) {
    console.log(`Username: ${username} and Password: ${password}`)
    const response = axios
        .post('https://api.kinectic.io/auth/local', {
            identifier: username,
            password: password,
        })
        .then(response => {
            // Handle success.
            console.log('Authenticating!');
            console.log('Authenticated Data', response.data);
            console.log('Authenticated User profile', response.data.user);
            return response.data;
        })
        .catch(error => {
            // Handle error.
            console.log('An error occurred, whilst trying to login user.', error.response);
            return error.response;
        });
    return response
}

