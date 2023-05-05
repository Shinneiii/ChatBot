'use strict';
export async function Nationality(params) {
    const response = await fetch(`https://api.nationalize.io?name=${params}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const value = await response.json();
    let txt = '';
    value.country.forEach(prob => {
        txt += `Pays : ${prob.country_id} ~ Probabilité : ${Math.round(prob.probability * 10000) / 100}%<br />`;
    });
    return txt;
}

export async function Gender(params) {
    const response = await fetch(`https://api.genderize.io?name=${params}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const value = await response.json();
    return `Prénom : ${value.name} <br /> Genre : ${value.gender} <br /> Probabilité : ${Math.round(value.probability * 10000) / 100}% <br /> Nombre : ${value.count} personnes`;
}

export async function ZipCode(params) {
    const response = await fetch(`https://api.zippopotam.us/fr/${params}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const value = await response.json();
    let txt = '';
    txt += `Code postal : ${params}<br />`;
    value.places.forEach(place => {
        txt += `~ ${place['place name']} <br />`;
    });
    return txt;
}

export async function ChatGPT(params) {
    let key1 = 'eMj8ERzyXbpYR7ARYSKQT3Bl';
    let key2 = 'bkFJdXyBGrifycKwYcZmKsDX';
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer sk-${key1}${key2}`,
        },
        body: JSON.stringify({
            messages: [{ role: "user", content: params }],
            max_tokens: 100,
            model: "gpt-3.5-turbo",
        }),
    });
    const value_1 = await response.json();
    return value_1.choices[0].message.content;
}