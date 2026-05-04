import bcrypt from 'bcrypt';

const passwordChiara = 'Mamitiamo23'; // Scrivi qui la password che vuoi usare
const saltRounds = 10;

bcrypt.hash(passwordChiara, saltRounds, (err, hash) => {
    console.log("Copia questo hash nel database:");
    console.log(hash);
});