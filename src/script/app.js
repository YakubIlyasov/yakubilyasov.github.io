'use strict';

//Variables
var manga = false;
var english = false;
var input = "";
var url = "";
var titleEnglish = "";
var titleRomaji = "";
var propTitleRomaji = "";
var propTitleEnglish = "";
var propSynopsis = "";
var propImageLarge = "";
var titleExists = true;

function GetAnimeData() { //Get anime data from API
    //Declare variables
    url = 'https://kitsu.io/api/edge/anime?filter[text]=';
    input = document.getElementById('search').value.toLowerCase();

    if (manga == true) { //If switch is set to manga
        url = 'https://kitsu.io/api/edge/manga?filter[text]=';
    }

    if ((input != null) && (input != "")) { //Check if input is not null or empty
        url = url + input; //Add input to url

        $.getJSON(url, function (data) { //Get data from JSON
            var lstData = data["data"]; //Get list with data

            for (var index = 0; index < lstData.length; index++) { //Go through list with anime results from query
                titleRomaji = lstData[index]["attributes"]["titles"]["en_jp"]; //Get property title in romaji
                titleEnglish = lstData[index]["attributes"]["titles"]["en"]; //Get property title in English

                if (titleRomaji != null) { //Check if Japanese title is not null
                    if (titleRomaji.toLowerCase() == input) { //Check if Japanese title matches the search query
                        SetAttributeData(lstData, index); //Set attribute data to variables
                        break; //Exit for-loop
                    }
                    else { //Title doesn't match query
                        TitleDoesNotExist(); //Display data when anime/manga doesn't exist
                    }
                }

                if (titleEnglish != null) { //Check if English title is not null
                    if (titleEnglish.toLowerCase() == input) { //Check if English title matches the search query
                        SetAttributeData(lstData, index); //Set attribute data to variables
                        break; //Exit for-loop
                    }
                    else { //Title doesn't match query
                        TitleDoesNotExist(); //Display data when anime/manga doesn't exist
                    }
                }

                else { //Title not found
                    TitleDoesNotExist(); //Display data when anime/manga doesn't exist
                }
            }

            if (titleExists == true) { //Check if the title exists
                CheckTitle(); //Checks if title is null to display "Not available"
                CheckImage(); //Checks if image is null to display "ImageNotFound"
                CheckSynopsis(); //Checks if synopsis is null to display "Synopsis not available"

                if (english == true) { //Check if switch is set to English
                    $('#animeTitle').html(propTitleEnglish); //Change title to english
                } else { //Switch is off
                    $('#animeTitle').html(propTitleRomaji); //Change title to romaji
                }

                $('#animeSynopsis').html(propSynopsis); //Change synopsis
                $('#animeImage').attr('src', propImageLarge); //Change image
            } else { //The title doesn't exist
                TitleDoesNotExist(); //Display data when anime/manga doesn't exist
            }
        });
    }
}

function CheckTitle() { //Checks if title is null to display "Not available"
    if (propTitleEnglish == null) {
        propTitleEnglish = "Not available";
    }
    if (propTitleRomaji == null) {
        propTitleRomaji = "Not available";
    }
}

function CheckImage() { //Checks if image is null to display "ImageNotFound"
    if (propImageLarge == null) {
        propImageLarge = "../dist/media/ImageNotFound.jpg";
    }
}

function CheckSynopsis(params) { //Checks if synopsis is null to display "Synopsis not available"
    if (propSynopsis == null) {
        propSynopsis = "Synopsis not available.";
    }
}

function SetAttributeData(lstData, index) { //Set attribute data to variables
    propTitleRomaji = lstData[index]["attributes"]["titles"]["en_jp"]; //Get property title in romaji
    propTitleEnglish = lstData[index]["attributes"]["titles"]["en"]; //Get property title in English
    propSynopsis = lstData[index]["attributes"]["synopsis"]; //Get property synopsis
    propImageLarge = lstData[index]["attributes"]["posterImage"]["large"]; //Get property image
    document.getElementById('search').value = ""; //Reset input
    titleExists = true; //Set title exists flag on true
}

function TitleDoesNotExist() { //Display data when anime/manga doesn't exist
    $('#animeTitle').html("Not available"); //Change title to english
    $('#animeSynopsis').html("Synopsis not available."); //Change synopsis
    $('#animeImage').attr('src', "../dist/media/ImageNotFound.jpg"); //Change image
    titleExists = false; //Set title exists flag on false
}

function SwitchMangaIsChanged() { //Set manga filter on/off
    if (document.getElementById("switch_manga").checked) { //If switch is checked
        manga = true; //Set manga filter to true
    } else { //If switch is not checked
        manga = false; //Set manga filter to false
    }
}

function SwitchEnglishIsChanged() { //Set English title on/off
    if (document.getElementById("switch_english").checked) { //If switch is checked
        english = true; //Set English title filter to true
        if (titleExists == true) { //If the title exists
            if ((propTitleEnglish != null) && (propTitleEnglish != "")) { //If title is not null or empty
                $('#animeTitle').html(propTitleEnglish); //Change title to english
            }
        }

    } else { //If switch is not checked
        english = false; //Set English title filter to false
        if (titleExists == true) { //If the title exists
            if ((propTitleRomaji != null) && (propTitleRomaji != "")) { //If title is not null or empty
                $('#animeTitle').html(propTitleRomaji); //Change title to english
            }
        }
    }
}

//Create event for when page is loaded
document.addEventListener('DOMContentLoaded', function () {
    SwitchMangaIsChanged(); //Set manga filter on/off
    SwitchEnglishIsChanged(); //Set English title on/off
});

//Create event for status change from switch manga
var checkboxManga = document.querySelector("input[id=switch_manga]");
checkboxManga.addEventListener('change', SwitchMangaIsChanged);

//Create event for status change from switch english
var checkboxEnglish = document.querySelector("input[id=switch_english]");
checkboxEnglish.addEventListener('change', SwitchEnglishIsChanged);

//Create event for clicking on search icon
document.getElementById('btnSearch').addEventListener('click', GetAnimeData);

//Create event for pressing "enter" on keyboard
document.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
        GetAnimeData();
    }
});