let version = "1.16";
let file;
let result;

document.getElementById('uploadButton').addEventListener('change', () =>
{
    var data = document.getElementById('uploadButton').files[0];

    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsArrayBuffer(data);

    //console.log(data);
});
document.getElementById('cars').addEventListener('change', () =>
{
    version = document.getElementById('cars').value;
    computeOutput(file);
});

const outputText = document.getElementById("outputText");

outputText.addEventListener("dblclick", function ()
{
    if (outputText.firstChild === null || outputText.firstChild === undefined) return;

    const selection = window.getSelection();
    const range = document.createRange();

    range.setStartBefore(outputText.firstChild);
    range.setEndAfter(outputText.lastChild);
    selection.removeAllRanges();
    selection.addRange(range);
});

document.getElementById("selectButton").addEventListener("click", function ()
{
    document.getElementById("uploadButton").click();
});

const downloadButton = document.getElementById("downloadButton");
const downloadFile = document.getElementById("downloadFile");

downloadButton.addEventListener("click", function ()
{
    if (downloadButton.className.includes("hide")) return;

    downloadFile.click();
});

function handleFileLoad(data)
{
    console.log(data);
    file = data.target.result;
    computeOutput(file);
};

function handleNBT(data)
{

    //debugger;

    if (data.value)
    {
        data = handleNBT(data.value);
    }
    else
    {
        if (typeof data === "object")
        {
            for (key in data)
            {
                if (data[key].type && (data[key].type === "compound" || data[key].type === "list"))
                {
                    data[key] = handleNBT(data[key].value)
                }
                else if (data[key].value !== undefined)
                {
                    if (data[key].type === "byte")
                    {
                        data[key] = "%(_(*)_)!@#$%^&*()_+" + data[key].value + "b%(_(*)_)!@#$%^&*()_+"
                    }
                    else if (data[key].type === "short")
                    {
                        data[key] = "%(_(*)_)!@#$%^&*()_+" + data[key].value + "s%(_(*)_)!@#$%^&*()_+"
                    }
                    else if (data[key].type === "intArray")
                    {
                        data[key] = data[key].value;
                        data[key].unshift("%(_(*)_)!@#$%^&*()_+I;%(_(*)_)!@#$%^&*()_+%(_(*)_)!@#$%^&*()_+");
                    }
                    else
                    {
                        data[key] = data[key].value;
                    }
                }
                else
                {
                    data[key] = handleNBT(data[key]);
                }
            }
        }
    }
    return data;
}

function computeOutput(data)
{
    if (!data) return;
    nbt.parse(data, function (error, data)
    {
        if (error) { throw error; }

        //debugger;

        let blocknames = [];

        for (var i = 0; i < data.value.palette.value.value.length; i++)
        {
            let block;
            if (!data.value.palette.value.value[i].Properties)
            {
                block = data.value.palette.value.value[i].Name.value;
            }
            else
            {
                block = {
                    value: data.value.palette.value.value[i].Name.value,
                    properties: {}
                }
                for (key in data.value.palette.value.value[i].Properties.value)
                {
                    let property = data.value.palette.value.value[i].Properties.value[key].value;
                    block.properties[key] = property;
                }
            }



            blocknames.push(block);
        }



        let predicate = [];


        for (var i = 0; i < data.value.blocks.value.value.length; i++)
        {
            let block = data.value.blocks.value.value[i];
            debugger;
            predicate.push({
                "condition": "minecraft:location_check",
                "offsetX": block.pos.value.value[0],
                "offsetY": block.pos.value.value[1],
                "offsetZ": block.pos.value.value[2],
                "predicate": {
                    "block": {},
                    "fluid": {}
                }
            });

            if (block.nbt)
            {
                predicate[predicate.length - 1]["predicate"]["block"]["nbt"] = JSON.stringify(handleNBT(block.nbt.value));
            }

            if (blocknames[block.state.value].value === "minecraft:water" || blocknames[block.state.value].value === "minecraft:lava")
            {
                if (blocknames[block.state.value].properties.level === "0")
                {
                    predicate[predicate.length - 1]["predicate"]["fluid"]["fluid"] = blocknames[block.state.value].value
                }
                else
                {
                    if (blocknames[block.state.value].value === "minecraft:water") predicate[predicate.length - 1]["predicate"]["fluid"]["fluid"] = "minecraft:flowing_water";
                    if (blocknames[block.state.value].value === "minecraft:lava") predicate[predicate.length - 1]["predicate"]["fluid"]["fluid"] = "minecraft:flowing_lava";
                    predicate[predicate.length - 1]["predicate"]["fluid"].state = {};

                    let level = blocknames[block.state.value].properties.level;
                    if (level === "1")
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "7"
                    }
                    else if (level === "2")
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "6"
                    }
                    else if (level === "3")
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "5"
                    }
                    else if (level === "4")
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "4"
                    }
                    else if (level === "5")
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "3"
                    }
                    else if (level === "6")
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "2"
                    }
                    else
                    {
                        predicate[predicate.length - 1]["predicate"]["fluid"].state["level"] = "1";
                    }

                }
            }
            else
            {
                if (version === "1.16")
                {
                    predicate[predicate.length - 1]["predicate"]["block"]["block"] = blocknames[block.state.value]
                }
                else
                {
                    predicate[predicate.length - 1]["predicate"]["block"]["blocks"] = [blocknames[block.state.value]]
                }
                if (blocknames[block.state.value].value)
                {
                    block = blocknames[block.state.value];
                    if (version === "1.16")
                    {
                        predicate[predicate.length - 1]["predicate"]["block"]["block"] = block.value;
                    }
                    else
                    {
                        predicate[predicate.length - 1]["predicate"]["block"]["blocks"] = [block.value];
                    }
                    predicate[predicate.length - 1]["predicate"]["block"].state = {};
                    for (key in block.properties)
                    {
                        let property = block.properties[key];
                        predicate[predicate.length - 1]["predicate"]["block"].state[key] = property;
                    }
                }
            }

            //console.log(blocknames[block.state.value]);
        }

        result = JSON.stringify(predicate, null, "  ").replaceAll("%(_(*)_)!@#$%^&*()_+%(_(*)_)!@#$%^&*()_+\\\",", " ").replaceAll("\\\"%(_(*)_)!@#$%^&*()_+", "").replaceAll("%(_(*)_)!@#$%^&*()_+\\\"", "")

        outputText.textContent = result;

        downloadButton.classList.remove("hide");
        downloadFile.href = "data:application/json;charset=utf-8," + encodeURIComponent(result);
    });
}