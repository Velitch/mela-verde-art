import bcrypt from 'bcrypt';

const passwordChiaro = 'MelaverdeTVB';

bcrypt.hash(passwordChiaro, 10, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Copia questo hash nel DB:");
    console.log(hash);
});