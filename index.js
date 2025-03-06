(function() {
  'use strict'
  
  const inputForGetRequest = document.querySelector('.app-container__input');
  const autocompliteList = document.querySelector('.app-container__autocomplete-list');
  const resultDisplay = document.querySelector('.app-container__result-text');
  const containerAdded = document.querySelector('.container-added');

  function createAddedItem(parent, name, owner, stars) {
    const addedItem = document.createElement('div');
    addedItem.classList.add('container-added__item');

    const addedContainerText = document.createElement('div');
    addedContainerText.classList.add('container-added__text');
    // Name
    const nameText = document.createElement('p');
    nameText.classList.add('container-added__text-name', 'heading');
    nameText.textContent = 'Name: ';
    
    const textResultName = document.createElement('span');
    textResultName.classList.add('container-added__text-result-name');
    textResultName.textContent = name;
    // Owner
    const ownerText = document.createElement('p');
    ownerText.classList.add('container-added__text-owner', 'heading');
    ownerText.textContent = 'Owner: ';

    const textResultOwner = document.createElement('span');
    textResultOwner.classList.add('container-added__text-result-owner');
    textResultOwner.textContent = owner;
    // Stars
    const starsText = document.createElement('p');
    starsText.classList.add('container-added__text-stars', 'heading');
    starsText.textContent = 'Stars: ';

    const textResultStars = document.createElement('span');
    textResultStars.classList.add('container-added__text-result-stars');
    textResultStars.textContent = stars;
    // Button
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('container-added__button-delete');
    buttonDelete.textContent = 'X';
    
    // Appending
    nameText.appendChild(textResultName);
    ownerText.appendChild(textResultOwner);
    starsText.appendChild(textResultStars);

    addedContainerText.appendChild(nameText);
    addedContainerText.appendChild(ownerText);
    addedContainerText.appendChild(starsText);

    addedItem.appendChild(addedContainerText);
    addedItem.append(buttonDelete);

    parent.appendChild(addedItem);

    buttonDelete.addEventListener('click', () => {
      console.log('click - OK')
      addedItem.remove();
    })
    
  }
  
  
  function sendRequest() {
    let interval = true;

    return async function(key) {
      if (!interval) {
        return [];
      }

      interval = false;
      setTimeout(() => interval = true, 1000);

      try {
        const request = await fetch(`https://api.github.com/search/repositories?q=${key}`);
        const data = await request.json();
        return data.items || [];
      }
      catch(err) {
        console.error('Error when receiving repositories', err);
        return [];
      }
    }
  }

  const getItems = sendRequest();
 
  async function getRepos(key) {
    if (!key.trim()) {
      autocompliteList.style.display = 'none';
      return;
    }
    const items = await getItems(key);

    autocompliteList.innerHTML = '';
      
    if (items.length > 0) {
      items.slice(0, 5).forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('app-container__autocomplete-list-item');
        listItem.textContent = item.name;
        autocompliteList.appendChild(listItem);

        
        listItem.addEventListener('click', () => {
          createAddedItem(containerAdded, item.name, item.owner.login, item.stargazers_count);
          autocompliteList.style.display = 'none';
          inputForGetRequest.value = '';
          resultDisplay.textContent = '';
        }); 

      });

      
      autocompliteList.style.display = 'block';
    } else {
      autocompliteList.style.display = 'none';
    }
  }



  inputForGetRequest.addEventListener('input', () => {
    getRepos(inputForGetRequest.value);
    resultDisplay.textContent = inputForGetRequest.value;
  });
  
  document.addEventListener('click', (event) => {
    const autocompliteList = document.querySelector('.app-container__autocomplete-list');

    if (!autocompliteList.contains(event.target) && !inputForGetRequest.contains(event.target)) {
      autocompliteList.style.display = 'none';
    }
  });

})();


