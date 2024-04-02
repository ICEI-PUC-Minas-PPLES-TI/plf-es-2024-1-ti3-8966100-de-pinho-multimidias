// varíaveis do cadastro
var formCadastro = document.getElementById("forms-cadastro");
var btnCadastro = document.getElementById("btn-cadastro");
var emailCadastro = document.getElementById("email-cadastro");
var senhaCadastro = document.getElementById("password-cadastro");
var ultimoNome = document.getElementById('ultimo_nome');
var primeiroNome = document.getElementById('primeiro_nome');
var contato = document.getElementById('contato');

// variáveis do login
var formLogin = document.getElementById("forms-login");
var btnLogin = document.getElementById("btn-login");
var emailLogin = document.getElementById("email-login");
var senhaLogin = document.getElementById("password-login");

// endpoints 
var urlCadastro = "http://localhost:8080/register";
var urlLogin = "https://localhost:8080/login";

// enviar dados do cadastro
btnCadastro.addEventListener("click", function (e) {
    e.preventDefault();

    var data = {
        email: emailCadastro.value,
        senha: senhaCadastro.value,
        primeiroNome: primeiroNome.value,
        ultimoNome: ultimoNome.value,
        contato: contato.value,
        tipoUsuario: "CLIENTE"
    }

    axios.post(urlCadastro, data)
        .then(response => {
            console.log('Cadastro realizado com sucesso', response.data);
        })
        .catch(error => {
            if (error.response) {
                console.log("Data:", error.response.data);
                console.log("Status:", error.response.status);
                console.log("Headers:", error.response.headers);
            } else if (error.request) {
                console.log("Request:", error.request);
            } else {
                console.log("Error:", error.message);
            }
            console.log("Config:", error.config);
        })

})


btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    var data = {
        email: emailLogin.value,
        senha: senhaLogin.value
    }

    axios.post(urlLogin, data)
        .then(response => {
            console.log('Login realizado com sucesso', response.data);
        })
        .catch(error => {
            if (error.response) {
                console.log("Data:", error.response.data);
                console.log("Status:", error.response.status);
                console.log("Headers:", error.response.headers);
            } else if (error.request) {
                console.log("Request:", error.request);
            } else {
                console.log("Error:", error.message);
            }
            console.log("Config:", error.config);
        })

})

/* Início de Teste de login pelo Google */

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload)
}

window.handleCredentialResponse = (response) => {
    let = response;
    responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    $("#name").text(responsePayload.name)
    $("#email").text(responsePayload.email)
    $("#image").attr('src', responsePayload.picture)
    $(".data").css("display", "block")
    $(".g-signin2").css("display", "none")
    $(".container").css("display", "none")
}


function signOut() {
    google.accounts.id.revoke;;
    alert("Você foi deslogado")
    $(".g-signin2").css("display", "block")
    $(".container").css("display", "block")
    $(".data").css("display", "none")
};

/* Fim de Teste de login pelo Google */

/** Login pelo Gmail */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '4702882738-dfpp9qr71nbf9jbog01pql775ou3c7sj.apps.googleusercontent.com';
const API_KEY = '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';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        $(".data-gmail").css("display", "block")
        $(".g-signin2").css("display", "none")
        $(".container").css("display", "none")
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listLabels();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
        $(".g-signin2").css("display", "block")
        $(".container").css("display", "block")
    }
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function listLabels() {
    let response;
    try {
        response = await gapi.client.gmail.users.labels.list({
            'userId': 'me',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    const labels = response.result.labels;
    if (!labels || labels.length == 0) {
        document.getElementById('content').innerText = 'No labels found.';
        return;
    }
    // Flatten to string to display
    const output = labels.reduce(
        (str, label) => `${str}${label.name}\n`,
        'Labels:\n');
    document.getElementById('content').innerText = output;
}


/** Fim login pelo Gmail */