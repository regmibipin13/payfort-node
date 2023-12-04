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
            document.getElementById('signature').value = response.data.signature;
        }
    }
    catch(error) {
        console.log(error);
    }

}