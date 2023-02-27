# PixelWar

This is a project forked on Codiscovery/pixel_love repo based on the reddit game by Josh Warddle : r/place. 
This code changes the pixel war gameplay to manage a game for less users and less pixels. The main changes are the colorPicker instead of the colors pre selected and a cooldown per pixel instead of a timer per users like in the reddit's r/place.

Original repo : https://github.com/Codiscovery/pixel_love

## To deploy on cPanel with cloudlinux with node 18

- add a strat.cjs file 
- add the extension .mjs to your starting file. Here it is : index.js -> index.mjs
- in your package json check you have : "type :"modules"". Then change your "main" with the .cjs file and don't forget to change also your lauching file with the .mjs extension 
- in the start.cjs file add 

````
async function loadApp() {
    await import("index.mjs");
}

loadApp();
````

- Then uninstall node-fetch to downgrade it to the 2.6.1 version : 

`npm uninstall node-fetch`
`npm uninstall @types/node-fetch`

`npm install node-fetch@^2.6.1`
`npm install --save-dev @types/node-fetch@2.5.12`

Upload your web app folder with a file manager like FileZilla and lauch it with the right folder path and node version




