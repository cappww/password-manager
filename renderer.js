


$(() => {

    let pass = passwords.AUTHENTIFIANT;
    pass.forEach(element => {


        $("tbody").append(
            `<tr>
                <td>
                    ${element.domain}
                </td>
                <td>
                    ${element.login}
                </td>
                <td>
                    ${element.password}
                </td>
            </tr>`
        );
    });
    
    $("#btn").click(() => {
        const bf = new Blowfish( $('#input-text').val() );
        const encrypted = bf.encrypt( "Secret message" );
        let encryptedMime = bf.base64Encode(encrypted);
        //alert(pass + " " + encryptedMime );

       

    });

    
});