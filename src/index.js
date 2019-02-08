const url = "http://localhost:3000/hogs";
const hogDiv = document.getElementById('hog-container');
const hogForm = document.getElementById('hog-form');

function loadHogs(){
  fetch(url)
  .then(response => response.json())
  .then(hogs => hogs.forEach(makeHog))
}

loadHogs();

function makeHog(hog){
  const div = document.createElement('div');
  div.className = "hog-card";
  const isGreased = hog.greased;
  div.innerHTML = `<h3>Name: ${hog.name}</h3><p>Specialty: ${hog.specialty}</p><p>Weight: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</p>
  <p>Medal: ${hog["highest medal achieved"]}</p><img src="${hog.image}" /><br><button data-id="${hog.id}" type="button" class="delete">Delete</button>`
  if (isGreased){
    div.innerHTML += `<br><span>Greased: <input class="greased" data-id="${hog.id}" type="checkbox" name="greased" value="greased" checked></span>`
  } else {
    div.innerHTML += `<br><span>Greased: <input class="greased" data-id="${hog.id}" type="checkbox" name="greased" value="greased"></span>`
  }
  hogDiv.appendChild(div);
}

hogForm.addEventListener("submit", submitForm);

function submitForm(event){
  event.preventDefault();

  const newObj = {
    name: event.target.name.value,
    specialty: event.target.specialty.value,
    "highest medal achieved": event.target.medal.value,
    "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": event.target.weight.value,
    image: event.target.img.value,
    greased: event.target.greased.checked,
  }

  console.log(newObj);

  //fetch
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newObj)
  })
  .then(response => response.json())
  .then(data => {
    event.target.reset();
    makeHog(data);
  })

}

hogDiv.addEventListener('click', deleteHog);

function deleteHog(event){
  if (event.target.classList.contains('delete')){
    const id = event.target.dataset.id;
    const div = event.target.parentElement;

    fetch(url + '/' + id, {
      method: 'DELETE',
    })
    .then(div.remove())
  }
}

hogDiv.addEventListener('change', changeGrease);

function changeGrease(event){
  if (event.target.classList.contains('greased')){
    const id = event.target.dataset.id;

    fetch(url + '/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({greased: event.target.checked})
    })
    .then(response => response.json())
    .then(console.log)
  }
}
