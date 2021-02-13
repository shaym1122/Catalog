var myMat;
var myAPI;
var myJson;

var myModelsId = [];

$(document).ready(function () {
    var version = '1.9.0';
    var uid = '1857102417884259b24116250048db5b';//model ID
    var iframe = document.getElementById('myF');
    var client = new window.Sketchfab(version, iframe);
    var curTag = 'sinks'

    $(".modifyDiv").hide();

    var success = function (api) {
        api.start(function () {
            api.addEventListener('viewerready', function () {
                myAPI = api;
                api.getMaterialList(function (err, materials) {
                    myMat = materials;

                    console.log(myMat);
                    
                    var startObjColor = $(".modifyDiv[tag='"+curTag+"'].colorsBtns input.colorBtn:first-child").attr("colorValue").split(',');
                    var startObjRoughness = $(".modifyDiv[tag='"+curTag+"'].colorsBtns input.colorBtn:first-child").attr("roughnessValue");
                    var startObjModel = $(".modifyDiv[tag='"+curTag+"'].modelsBtns input.modelBtn:first-child").attr("matName");

                    var startObjNotMat = $(".modifyDiv[tag='"+curTag+"'].colorsBtns").attr("notMat").split(',');

                    $.each(myMat, function (index, mat) {
                        if (mat.id == startObjModel) {
                            mat.channels.Opacity.factor = 1;
                        }
                        else {
                            mat.channels.Opacity.factor = 0;
                        }

                        if (!startObjNotMat.includes(mat.id)) {
                            mat.channels.AlbedoPBR.color = startObjColor;
                            mat.channels.RoughnessPBR.factor = startObjRoughness;
                        }
                        
                        myAPI.setMaterial(mat, function () {
                            console.log('Material updated');
                        });
                    });
                    
                });

                //$(".modifyDiv").hide();
                $(".modifyDiv[tag='"+curTag+"']").show();
            });
        });
    };

    var error = function () {
        console.error('Sketchfab API error');
    };

    client.init(uid, {
        success: success,
        error: error,
        autostart: 1,
        preload: 1
    });

    //createPage();


    $(".colorBtn").click(function () {
        var selectedColorS = $(this).attr("colorValue");
        var selectedColor = selectedColorS.split(',');

        var selectedRoughness = $(this).attr("roughnessValue");

        var notMatS = $(this).parent().attr("notMat");
        var notMat = notMatS.split(',');

        $.each(myMat, function (index, mat) {
            if (!notMat.includes(mat.id)) {
                mat.channels.AlbedoPBR.color = selectedColor;
                mat.channels.RoughnessPBR.factor = selectedRoughness;
                myAPI.setMaterial(mat, function () {
                    console.log('Material updated');
                });
            }
        });
    });

    $(".modelBtn").click(function () {
        var curMat = $(this).attr("matName");

        $.each(myMat, function (index, mat) {
            console.log(mat);
            if (mat.id == curMat) {
                mat.channels.Opacity.factor = 1;
            }
            else {
                mat.channels.Opacity.factor = 0;
            }
            myAPI.setMaterial(mat, function () {
                console.log('Material updated');
            });
        });
    });

    $(".changeObject").click(function () {
        var curObject = $(this).attr("objId");

        var uid = curObject;//model ID

        curTag = $(this).attr("tag");
        $(".modifyDiv").hide();

        client.init(uid, {
            success: success,
            error: error,
            autostart: 1,
            preload: 1
        });
    });

    $(".togglePart").click(function() {
        var curParts = $(this).attr("partName").split(',');

        $.each(myMat, function (index, mat) {
            if(curParts.includes(mat.id)) {
                if(mat.channels.Opacity.factor == 1) {
                    mat.channels.Opacity.factor = 0
                }
                else {
                    mat.channels.Opacity.factor = 1;
                }

                myAPI.setMaterial(mat, function () {
                    console.log('Material updated');
                });
            }
        })
    });

    $(".toggleAnimation").click(function() {
        var curStat = $(this).attr("status");

        if(curStat == "play") {
            $(this).attr("status","stop");
            myAPI.pause();
        }
        else {
            $(this).attr("status","play");
            myAPI.play();
        }
    });
});
