function swal_error(message = 'there is an error')
{
    Swal.fire({
        icon: 'error',
        html: "<textarea class='form-control form-control-sm' style='font-size: small' rows='5'>"+message+"</textarea>",
    })
}

function swal_response(icon='info',title = 'SWAL RESPONSE',text ='') {
    swal.fire({
        icon: icon,
        title: title,
        html:text,
    })
}

function error_handler(response)
{
    // split response
    if(response.split('%%').length === 2)
    {
        let response_split = response.split('%%');
        let response_type = response_split[0];
        let response_message = response_split[1];
        console.log(response)
        // $('#gen_modal').modal('hide')
        // switching response type
        switch (response_type)
        {
            case 'done':
                switch (response_message){
                    case 'msg_sent':
                        $('#convo_message').val('')
                        load_convo_message()
                        break;
                    default:
                        swal_reload("Process Completed")
                        console.table(response_message)
                        break;
                }
                break

            case 'error':
                swal_response('error','PROCEDURE ERROR',response_message)
                break;
            default:
                swal_response('info','SYSTEM INFORMATION',response_message)
        }

    }
}

function swal_reload(message='')
{
    Swal.fire({

        icon: 'success',
        title: 'RELOAD',
        text:message,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'OK',
        denyButtonText: `Don't save`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            location.reload()
        } else if (result.isDenied) {
            location.reload()
        }
    })
}

// process completed
function task_successful(message='Task completed successfully')
{
    Swal.fire({

        icon: 'success',
        text:message,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'OK',
        denyButtonText: `Don't save`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            location.reload()
        } else if (result.isDenied) {
            location.reload()
        }
    })
}

