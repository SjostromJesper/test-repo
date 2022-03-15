import CatImageBox from './component/CatImageBox/CatImageBox'
import {useEffect, useState} from "react";

function App() {
    const [catUrlArray, setCatUrlArray] = useState([]);
    const [catUrl, setCatUrl] = useState('');

    const [text, setText] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        const temp = [];
        for(let i = 0 ; i < localStorage.length ; i++) {
            temp.push(localStorage.getItem(localStorage.key(i)));
        }
        setCatUrlArray(temp);

        handleClick();
    }, []);

    useEffect(() => {

        if(catUrl.length <= 0) {
            return;
        }

        const key = Math.floor((Math.random() +1) * 1000000);
        const urlObj = {
            key: key,
            url: catUrl
        };

        localStorage.setItem(key.toString(), JSON.stringify(urlObj));
        setCatUrlArray([...catUrlArray, JSON.stringify(urlObj)])
    }, [catUrl]);




    const handleClick = async (withtext) => {

        if(!withtext) {
            const response = await fetch('https://cataas.com/cat?json=true');
            const body = await response.json();

            setCatUrl("https://cataas.com" + body.url)
        }
        else {

            const response = await fetch(`https://cataas.com/cat/says/${text}?size=${size}&color=${color}`);
            const body = await response.blob();

            const blobToUrl = await URL.createObjectURL(body);
            setCatUrl(blobToUrl)
        }
    };


    return (
        <div className="App">
            <CatImageBox src={catUrl}/>
            <button onClick={() => handleClick(false)}>Show a new cat!</button>
            <button onClick={() => handleClick(true)}>show a cat with text!</button>

            <label htmlFor="">text</label>
            <input type="text" value={text} onChange={event => {setText(event.target.value)}}/>

            <label htmlFor="">size</label>
            <input type="number" value={size} onChange={event => {setSize(event.target.value)}}/>

            <label htmlFor="">color</label>
            <input type="text" value={color} onChange={event => {setColor(event.target.value)}}/>

            <ul>
                {
                    catUrlArray.map((imageUrl, index) => {
                        const imageObj = JSON.parse(imageUrl);

                        return (
                            <li key={index} onClick={() => {
                                localStorage.removeItem(imageObj.key);

                                setCatUrlArray([
                                    ...catUrlArray.slice(0, index),
                                    ...catUrlArray.slice(index + 1, catUrlArray.length)
                                ]);

                            }}>{imageObj.url}</li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default App;
