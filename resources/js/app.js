//  Get the current year for the copyright
 $('#year').text(new Date().getFullYear());

 $('.userChoice').on('click', function () {
    changeText(this);
 });

const changeText = (caller) => {
    let storedTxt = $(caller).text();
    $('.selector').text(storedTxt);
}