const { ipcRenderer } = require('electron');

$(() => {

    $('#btn').click(() => {
        ipcRenderer.send('action:decrypt', $('#private-key').val());
        $('#btn').remove();
        $('#private-key').remove();
    });

    ipcRenderer.on('alert', (e, data) => {
        alert(data);
    });

    ipcRenderer.on('show-passwords', (e, data) => {
        data.passwords.forEach(element => {
            $("tbody").append(`
                <tr class="row">
                    <td>
                        <span>${element.domain || element.title}</span>
                    </td>
                    <td>
                        <span>${element.login}</span>
                    </td>
                    <td>
                        <span>${element.password}</span>
                    </td>
                    <td id="col" style="width: 20%">

                    </td>
                </tr>`
            );
        });

        $('tr').not(':first').hover(function() {
            $(this).css('background', 'yellow');
            $(this).children('#col').append(`
                <button class="btn" id="copy-btn" value="${data.passwords[0].password}">
                    <img src="./assets/clipboard-regular.svg">
                </button>
                <button class="btn" id="edit-btn">
                    <img src="./assets/edit-regular.svg">
                </button>
                <button class="btn" id="delete-btn">
                    <img src="./assets/trash-alt-solid.svg">
                </button>
            `);
            let index = $(this).index()-1;
            let self = this;
            $('#copy-btn').click(function() {
                ipcRenderer.send('action:copy', data.passwords[index].password)
                alert("Password copied to clipboard");
            });
            
            $("#edit-btn").click(function() {
                $(self).find("span").hide();
                $(self).find('button').hide();
                $(self).children().each(function(i, element) {
                    if(i === 0){
                        let name = data.passwords[index].domain || data.passwords[index].title;
                        $(element).append(`<input value="${name}">`);
                    } else if(i === 1) {
                        let login = data.passwords[index].login;
                        $(element).append(`<input value="${login}">`);
                    } else if(i === 2) {
                        let password = data.passwords[index].password;
                        $(element).append(`<input value="${password}">`);
                    }
                })
            });
        }, function() {
            $(this).css('background', '');
            $(".btn").remove();
        });      
    });
});