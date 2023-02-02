import './style.css';

const Config = {
  numPeoplePerReload: 20,
  baseurl: 'https://randomuser.me/api',
};

const View = (() => {
  const contentDiv = document.getElementsByClassName('content')[0];
  const templateCard = document.getElementsByClassName('card')[0];
  templateCard.parentNode.removeChild(templateCard);
  contentDiv.innerHTML = '';

  const buildCardFromPerson = function (person) {
    let card = templateCard.cloneNode(true);

    card.getElementsByClassName('name')[0].innerHTML = `name: ${person.name}`;
    card.getElementsByClassName(
      'email'
    )[0].innerHTML = `email: ${person.email}`;
    card.getElementsByClassName(
      'phone'
    )[0].innerHTML = `phone: ${person.phone}`;
    card.getElementsByClassName('photo')[0].src = person.photo;

    const dobButton = card.getElementsByClassName('showB')[0];
    const dobStr = card.getElementsByClassName('birthday')[0];
    dobStr.innerHTML = `birthday: ${person.birthday}`;

    const margin = card.getElementsByClassName('margin')[0];
    dobButton.onclick = () => {
      margin.removeChild(dobButton);
      margin.appendChild(dobStr);
    };
    dobStr.onclick = () => {
      margin.removeChild(dobStr);
      margin.appendChild(dobButton);
    };
    margin.removeChild(dobStr);

    return card;
  };

  const render = (cards) => {
    contentDiv.innerHTML = '';
    cards.forEach((card) => contentDiv.appendChild(card));
  };

  return {
    buildCardFromPerson,
    render,
  };
})();

const Controller = (() => {
  const reload = () => {
    Promise.all(
      Array.from(Array(Config.numPeoplePerReload).keys()).map((_) =>
        fetch(Config.baseurl).then((x) => x.json())
      )
    )
      .then((jsons) => jsons.map((json) => new Model.Person(json)))
      .then((people) => people.map(View.buildCardFromPerson))
      .then(View.render)
      .catch((err) => alert(`error when fetching users ${err}`));
  };
  reload();
  document.getElementById('reload').onclick = reload;
  return {
    reload,
  };
})();

const Model = (() => {
  class Person {
    constructor(json) {
      json = json.results[0];
      this.name = `${json.name.first} ${json.name.last}`;
      this.email = json.email;
      this.phone = json.phone;
      this.photo = json.picture.large;
      this.birthday = json.dob.date;
    }
  }
  return {
    Person,
  };
})();
