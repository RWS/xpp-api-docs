// Sourced from swagger-ui-dist (then modified)

const sandboxMode = location.pathname === '/xpp/documentation/sandbox';
const specJSON = 'xpp-rest.json';

window.onload = function() {
  const swaggerConfig = {
    dom_id: '#swagger-ui',
    deepLinking: true,
    validatorUrl: null,
    filter: true,
    advancedFilter: {
      enabled: true,
    },
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  if (sandboxMode) {
    swaggerConfig.url = specJSON;
    swaggerConfig.onComplete = authorizeUser;
    swaggerConfig.tryItOutEnabled = true;
  } else {
    swaggerConfig.supportedSubmitMethods = [];
    swaggerConfig.onComplete = disableSandbox;
    swaggerConfig.spec = window.xppREST;
  }
  window.ui = SwaggerUIBundle(swaggerConfig);
}

function disableSandbox() {
  // Add classname that will hide interactive buttons with CSS
  document.body.classList.add('inert');
  // The only way to find out when SwaggerUI has rendered is a MutationObserver
  new MutationObserver(records => {
    if (records.find(record => record.target.id === 'swagger-ui')) {
      // Emulate behavior of SwaggerUI when it is in sandbox mode by linking to the spec’s JSON file
      const specTitle = document.querySelector('h2.title');
      const specLink = `<a target="_blank" href="${ specJSON }" rel="noopener noreferrer" class="link">${ specJSON }</a>`
      specTitle.insertAdjacentHTML('afterend', specLink);
    }
  }).observe(document, { childList: true, subtree: true });
}

async function authorizeUser() {
  try {
    const response = await fetch('../register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'name=Jane%20Doe&email=jdoe%40example.com'
    })
    const json = await response.text()
    const token = JSON.parse(json).token
    window.ui.preauthorizeApiKey('bearerAuth', token);
  } catch (error) {
    alert('Unable to pre-authorize test user! See the console log for details.');
    console.error('Could not pre-authorize test user.', error);
  }
}
