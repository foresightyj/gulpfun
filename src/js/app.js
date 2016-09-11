var $number = $("#number");

$number.on('input', function () {
    var n = parseInt($number.val());
    if (n) {
        $("#result").text(factorial(n));
    }
})
