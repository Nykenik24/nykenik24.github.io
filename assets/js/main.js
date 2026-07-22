const elements = document.querySelectorAll(".my-age");

/* I wasn't actually born at 00:00, I just
 * don't know at what hour I was exactly born.
 */
const bday = new Date("2012-04-22T00:00:00");

const updateAge = () => {
  const currentDate = new Date();

  let years = currentDate.getFullYear() - bday.getFullYear();
  let months = currentDate.getMonth() - bday.getMonth();
  let days = currentDate.getDate() - bday.getDate();

  // Borrow days from previous month
  if (days < 0) {
    months--;

    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    days += prevMonth.getDate();
  }

  // Borrow months from previous year
  if (months < 0) {
    years--;
    months += 12;
  }

  let nextBirthday = new Date(bday);
  nextBirthday.setFullYear(currentDate.getFullYear());

  if (currentDate > nextBirthday) {
    nextBirthday.setFullYear(currentDate.getFullYear() + 1);
  }

  const daysLeft = Math.floor(
    (nextBirthday - currentDate) / (1000 * 60 * 60 * 24)
  );


  const weeks = Math.floor(days / 7);
  days %= 7;

  const singOrPlural = (n, base) => {
    return n != 1 ? `${base}s` : base
  }

  const decades = Math.floor(years / 10);

  elements.forEach((e) => {
    e.textContent = `${decades} ${singOrPlural(decades, "decade")}, ${years - (decades * 10)} years, ${months} ${singOrPlural(months, "month")}, ${weeks} ${singOrPlural(weeks, "week")} and ${days} ${singOrPlural(days, "day")}`;
    e.title = `${daysLeft} ${singOrPlural(daysLeft, "day")} until next birthday`;
  });

  requestAnimationFrame(updateAge);
};

updateAge();
