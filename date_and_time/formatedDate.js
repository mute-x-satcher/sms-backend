const formattedDate = () => {
    const now = new Date(Date.now());

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayName = days[now.getDay()];

const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();

const formattedDate = `${dayName}, ${day}-${month}-${year}`;

return formattedDate

}

module.exports = formattedDate