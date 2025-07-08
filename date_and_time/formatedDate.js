const formattedDate = () => {
const today = new Date();

const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
const day = today.toLocaleDateString('en-GB', { day: '2-digit' });
const month = today.toLocaleDateString('en-GB', { month: 'short' });
const year = today.getFullYear();

const formattedDate = `${weekday}, ${day} ${month} ${year}`;
// const dateObj = {
//     formattedDate,
//     day,
//     month,
//     year
// }

return formattedDate

}
formattedDate()

module.exports = formattedDate