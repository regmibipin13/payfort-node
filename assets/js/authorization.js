document.addEventListener("DOMContentLoaded", function () {
    // Get all input elements
    const form = document.getElementById('form1');
    form.addEventListener('submit', async function(e){
        e.preventDefault();
        await onChangeFunction();
        form.submit();
    });
});
async function onChangeFunction() {

    const merchantReference = document.getElementById("merchant_reference").value;
    const amount = document.getElementById("amount").value;
    const rememberMe = document.getElementById("remember_me").checked ? 'YES' : 'NO';

    document.getElementById('remember_me').value = rememberMe

    // Construct the data object to be sent or processed
    const toBeSignatured = {
      merchant_reference:merchantReference,
      amount:amount,
    };
    
    try {
        const response = await axios.post('/signature',toBeSignatured);
        if(response.data.hasOwnProperty('signature')) {
            const form = document.getElementById('form1');
            document.getElementById('signature').value = response.data.signature;

            var access_code = document.createElement('input');
            access_code.type = 'hidden';
            access_code.name = 'access_code'
            access_code.value = response.data.access_code;

            form.appendChild(access_code);

            var merchant_identifier = document.createElement('input');
            merchant_identifier.type = 'hidden';
            merchant_identifier.name = 'merchant_identifier'
            merchant_identifier.value = response.data.merchant_identifier;
            form.appendChild(merchant_identifier);
        }
    }
    catch(error) {
        console.log(error);
    }

}