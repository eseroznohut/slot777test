var isSound = true

    const toggleSound = () => {
        var button = $('#SM_mute_button button')
        if (isSound) {
            button.html('Unmute')
            button.css({
                background: '#f66151',
                'box-shadow': '2px 2px 2px #8a362d, -2px -2px 2px #ff8c75',
            })
        } else {
            button.html('Mute')
            button.css({
                background: '#f5c211',
                'box-shadow': '2px 2px 2px #d0a50e, -2px -2px 2px #ffdf14',
            })
        }
        isSound = !isSound
    }

    $("#SM_bet").keypress(function (evt) {
        evt.preventDefault();
    });

    const showInstruction = () => {
        $('#SM_instruction').toggleClass('d-none');
    }

    const isEnoughCredit = () => {
        if (credit < $('#SM_bet').val()) disablePlayButton()
        else enablePlayButton()
    }

    const disablePlayButton = () => {
        $('#SM_play_btn').prop('disabled', true)
        $('#SM_play_btn').css({
            background: '#f66151',
            color: 'black',
            'box-shadow': '5px 5px 9px #8a362d,-5px -5px 9px #ff8c75',
        })
    }
    const enablePlayButton = () => {
        $('#SM_play_btn').prop('disabled', false)
        $('#SM_play_btn').css({
            background: '#57e389',
            'box-shadow': '5px 5px 9px #317f4d,-5px -5px 9px #7dffc5',
        })
    }
    const addWonEffect = (element) => {
        $(`${element}`).addClass('wonEffect');
    }
    const removeWonEffect = (element) => {
        $(`${element}`).removeClass('wonEffect');
    }


    const periodTime = 6000
    var credit = 1000

    const startSpin = () => {
        const bet = $('#SM_bet').val()
        $('#SM_won span').text('0')
        if (credit >= bet) {
            if (isSound) {
                var audio = new Audio('../assets/audio/spin.mp3');
                audio.play();
            }
            removeWonEffect('.spin_row')
            disablePlayButton()
            $('#SM_bet').prop('disabled', true) 

            subtractCredit(bet)

            spin(1, 9, 4, 'row_1', 3)
            spin(1, 9, 5, 'row_2', 4)
            spin(1, 9, 6, 'row_3', 5)

            setTimeout(() => {
                wonCredit(bet)
                enablePlayButton()
                $('#SM_bet').prop('disabled', false)
            }, periodTime)
        } else alert('Reload page to restart your game. Good luck next time.')
    }

    const wonCredit = (bet) => {
        const results = [111, 777, 333, 444, 555, 666, 888, 222, 11, 77, 33, 44, 55, 66, 88, 22]
        const awards = [1000, 800, 700, 60, 50, 40, 30, 20, 100, 20, 15, 10, 9, 8, 7, 5]

        const key_1 = $(`#row_1 .SM_active img`).attr('key')
        const key_2 = $(`#row_2 .SM_active img`).attr('key')
        const key_3 = $(`#row_3 .SM_active img`).attr('key')

        if (key_1 === key_2 && key_1 === key_3) {
            addWonEffect('.spin_row')
        } else if (key_1 === key_2) {
            addWonEffect('#spin_row_1')
            addWonEffect('#spin_row_2')
        } else if (key_2 === key_3) {
            addWonEffect('#spin_row_2')
            addWonEffect('#spin_row_3')
        }

        const result = $(`#row_1 .SM_active img`).attr('key') + $(`#row_2 .SM_active img`).attr('key') + $(`#row_3 .SM_active img`).attr('key')

        var won = 0
        for (var i = 0; i < results.length; i++) {
            if (result.includes(results[i])) {
                won = awards[i] * bet
                credit += won;
                isWon = true
                break;
            }
        }

        $('#SM_credit span').text(credit)
        $('#SM_won span').text(won)
    }

    const subtractCredit = (bet) => {
        credit -= bet
        $('#SM_credit span').text(credit)
    }

    const spin = (min, max, spin, row, time) => {
        var pairs = getRndInteger(spin, max);
        var result = getRndInteger(min, max);

        var activeValue = parseInt($(`#${row} .SM_active img`).attr('key')) 

        for (var i = 1; i <= pairs; i++) {
            for (var j = 1; j < max; j++) {
                activeValue++
                if (activeValue === max) activeValue = min
                $(`#${row}`).prepend(`<div class="SM_item"><img key='${activeValue}' src="../assets/image/${activeValue}.png" class="slotImage w-100" /></div>`)
            }
        }

        for (var i = 1; i < max; i++) {
            activeValue++
            if (activeValue === max) activeValue = min
            $(`#${row}`).prepend(`<div class="SM_item"><img key='${activeValue}' src="../assets/image/${activeValue}.png" class="slotImage w-100" /></div>`)
            if (activeValue === result) break
        }

        var height = $(`#${row}`).height()
        var constWidth = $('.SM_item').height()
        $(`#${row}`).css('top', `-${height - constWidth}px`) 

        $(`#${row}`).css('animation', `moving ${time}s ease-in-out forwards`) 

        if (isSound) {
            setTimeout(() => {
                var audio = new Audio('audio/done.mp3');
                audio.play();
            }, `${time}000`)
        }

        setTimeout(() => {
            $(`#${row}`).html(`<div class="SM_item SM_active"><img key='${result}' src="../assets/image/${result}.png" class="slotImage w-100" /></div>`)
            $(`#${row}`).css({
                animation: '',
                top: 0,
            })
        }, periodTime)

    }
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }