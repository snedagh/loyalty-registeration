$(function() {
    //hang on event of form with id=myform
    $("#general_form").submit(function(e) {
//prevent Default functionality
        e.preventDefault();
        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        $('#loader').modal('show')
        let formData = new FormData($(this).parents('form')[0]);

        formData = new FormData($('#general_form')[0]); // The form with the file inputs.
        const that = $(this),
            url = that.attr('action'),
            type = that.attr('method'),
            data = {};


        that.find('[name]').each(function (index,value){
            var that = $(this), name = that.attr('name');
            data[name] = that.val();
        });

        $.ajax({

            url: url,
            type: type,
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (response){

                console.log(response)
                error_handler(response);
                $('#loader').modal('hide')

            },

        });

        return false;


    });

});

function api_fetch(url) {
    var result = 0;
    $.ajax({
        url:url,
        type: 'GET',
        async: false,
        dataType: 'html',
        success: function (response) {
            console.log(`response from fetch ${response}`)
            result =  response
        },
        error: function (error)
        {
            console.log(`response from fetch ${error}`)
            result = error
        }
    })

    return result
}

function check_number(number) {
    let get = api_fetch(`/api/verifnum/${number}`)
    console.log(`check number fetch ${get}`)
    return get
}

function validate_card(card_number) {
    let get = api_fetch(`/api/verifcard/${card_number}`)
    console.log(`check number fetch ${get}`)
    return get
}

function loader(actions) {
    if(actions === 'show')
    {
        $('#loader').modal('show')
    } else
    {
        $('#loader').modal('hide')
    }
}

function validate_new() {
    let els = ['first_name','last_name','gender','nationality','email','id_type','id_number','date_of_birth','card_no','phone']
    let error = 0;
    let err_msg = ''

    for (let i = 0; i < els.length; i++) {

        let this_el = els[i]
        $(`#${this_el}`).removeClass('border-danger')
        if($(`#${this_el}`).val().length < 1)
        {
            error ++
            $(`#${this_el}`).addClass('border-danger')
            // empty
        }
    }

    // validate mobile number
    if (check_number($('#phone').val()) > 0)
    {
        error ++
        err_msg += ` Phone Number is taken \n`
    }

    // validate card
    if (validate_card($('#card_no').val()) > 0)
    {
        error ++
        err_msg += ` Card is taken || `
    }

    if (error === 0)
    {
        let err_msg = 'error%%'
        // check card length and check if card exist
        if($('#card_no').val().length !== 10) // check card length
        {
            error ++
            err_msg += `Card Number should be equal to 10 but ${$('#card_no').val().length} provided`
            $('#card_no').addClass('border-danger')
        }


        // todo check birthday
        let today =  new Date()
        let sel_date = new Date($('#date_of_birth').val())

        const date1 = new Date(`${sel_date.getMonth()}/${sel_date.getDay()}/${sel_date.getFullYear()}`);
        const date2 = new Date(`${today.getMonth()}/${today.getDay()}/${today.getFullYear()}`);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.table({'date1':date1,'date2':date2})
        console.log(diffTime + " milliseconds");
        console.log(diffDays + " days");

        if(diffDays < 18)
        {
            err_msg += 'Age must be more than or equal to 18 \n'
            error ++
        }

        if(date1 > date2)
        {
            err_msg += 'Date of birth must be lesser than today \n'
            error ++
        }


        if(error === 0)
        {
            // send otp
            let number, message

            number = $('#phone').val()
            message = "Provide your one time password "
            otp(number,message)
        }





    }
    else {
        if(err_msg.length > 0)
        {
            error_handler(`error%%${err_msg}`)
        }
    }

}

function verif_otp() {
    console.log('Hello')
    // $('#loader').modal('show')
    let set_token = sessionStorage.getItem('token')
    let provided_token = $('#otp_prov').val()

    if(set_token == provided_token)
    {
        // :: auth submit form
        let x_html = `<button class="btn btn-success rounded-0 w-100" type="submit">REGISTER CUSTOMER</button>`
        $('#auth_box').html(x_html)


    } else
    {
        // show invalid error
        error_handler('error%%OTP MISMATCH')
    }
}

function otp(number,message) {
    $('#loader').modal('show')
    let form_date = {
        'number':number,
        'message':message
    }

    let tried_count = 0;

    $.ajax({
        url:$('#otp_url').val(),
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'html',
        data:form_date,
        success: function (response) {
           let j_res = JSON.parse(response)
            console.log(`type of response = ${typeof(j_res)}`)
            let code = j_res['response']['code']
            if(code == '1000')
            {
                // send
                sessionStorage.setItem('token',j_res['otp'])

                // enable otp
                let x_html = `<div class="w-100 d-flex flex-wrap justify-content-between"><input type="text" id="otp_prov" class="form-control w-50"><button class="btn btn-info" type="button" onclick="verif_otp()">VERIFY</button></div>`
                $('#auth_box').html(x_html)
                $('#loader').modal('hide')


            }
            else
            {
                // not sent
                tried_count ++
                $('#messagebox').html(`<span class="text-danger">Could Not Send OTP... Re-dialing (${tried_count})</span>`)
                console.log(tried_count)
            }
            console.log(`response code ${code}`)
        },

    })



}

