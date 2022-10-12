'use strict';

const baseUrl = 'https://danepubliczne.imgw.pl/api/data/synop/';

const getCities = async e => {
    try {
        const response = await fetch(baseUrl);

        const data = await response.json();

        return data;
    } 
    catch(err) {

        console.error(err);

    }
}

getCities().then(data => {

    const select = document.querySelector('.form__input--select');

    for(let i=0; i<data.length; i++) {
        const option = document.createElement('option');
        option.innerHTML = data[i].stacja;
        const dataAttr = document.createAttribute('data-id');
        dataAttr.value = data[i].id_stacji;
        option.setAttributeNode(dataAttr);
        select.appendChild(option);
    }

}).catch((err) => console.error(err));


const getWeather = async id => {
    try {
        const response = await fetch(`${baseUrl}id/${id}`);

        const data = response.json();

        return data;
    }
    catch(err) {
        console.error(err);
    }
}

const checkWeather = e => {
    
    e.preventDefault();
    
    const select = document.querySelector('.form__input--select');

    const selectedIndex = select.selectedIndex;

    const selectedIdValue = select.options[selectedIndex].getAttribute('data-id');

    if(!(selectedIndex === 0)) {
        
        getWeather(selectedIdValue).then(data => {

            const { stacja } = data;
            const { temperatura } = data;
            const { cisnienie } = data;
            const { predkosc_wiatru } = data;
            const { suma_opadu } = data;
            const { data_pomiaru } = data;
            const { godzina_pomiaru } = data;

            const opady = suma_opadu > 1 ? 'opady' : 'brak';

            const godzina = godzina_pomiaru < 10 ? `0${godzina_pomiaru}:00` : `${godzina_pomiaru}:00`;

            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = 
            `
                <div class="row">
                    <h2 class="heading--h2 col">${stacja}</h2>
                    <p class="item__p--grey col"><span>${data_pomiaru}</span> | <span>${godzina}</span></p>
                </div>
                <div class="row row__icon row-cols-2">
                    <p class="item__icon item__icon--temp">${temperatura}C</p>
                    <p class="item__icon item__icon--pressure">${cisnienie} hpa</p>
                    <p class="item__icon item__icon--wind">${predkosc_wiatru} m/s</p>
                    <p class="item__icon item__icon--rain">${opady}</p>
                </div>
            `;

            const itemContainer = document.querySelector('.row__items');
            itemContainer.prepend(item);

        })
    }   
}


const form = document.querySelector('.form');

form.addEventListener('submit', checkWeather);