const { testEmail } = require('./emailService');

// Tester l'envoi d'email
console.log('Test d\'envoi d\'email...');
testEmail()
    .then(success => {
        if (success) {
            console.log('Test réussi ! Vérifiez votre boîte de réception.');
        } else {
            console.log('Le test a échoué. Vérifiez les logs pour plus de détails.');
        }
    })
    .catch(error => {
        console.error('Erreur lors du test:', error);
    });