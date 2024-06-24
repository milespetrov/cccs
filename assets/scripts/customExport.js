const timeSlices = [
    '2021-2040',
    '2041-2060',
    '2061-2080',
    '2081-2100'
  ]

const utcMonths = {
    0: 'jan',
    1: 'feb',
    2: 'mar',
    3: 'apr',
    4: 'may',
    5: 'jun',
    6: 'jul',
    7: 'aug',
    8: 'sep',
    9: 'oct',
    10: 'nov',
    11: 'dec'
}

async function fabricImageFromURL(image_url) {                                                                          
    return new Promise(function(resolve, reject) {                                                                        
        try {                                                                                                               
            fabric.Image.fromURL(image_url, function (image) {                                                                
                resolve(image);                                                                                                 
            }, {crossOrigin: 'anonymous'});                                                                                                               
        } catch (error) {                                                                                                   
            reject(error);                                                                                                    
        }                                                                                                                   
    });                                                                                                                   
}

export function customRendererStartup(ramp, store, i18n) {
    ramp.fixture.get('export').customRenderer(customExportRenderer);

    async function customExportRenderer(canvas, { map, scaleBar, northArrow }, { margin }) {
        
        // Set the canvas width to always be 1240, css will scale it as needed to fit the panel
        canvas.setDimensions({
            width: 1240
        });

        margin = {
            TOP: margin.TOP / 2,
            RIGHT: margin.RIGHT / 2,
            BOTTOM: margin.BOTTOM / 2,
            LEFT: margin.LEFT / 2
        };

        let runningHeight = margin.TOP;


        // ----- Export title -----
        const titleObj = new fabric.Text(`${i18n.t('title')} - ${i18n.t(`datasetSelector.${store.datasetId}.shortName`)}`, {
            fontFamily: 'Montserrat, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
            fill: '#000',
            fontSize: 24,
            top: margin.TOP,
            left: margin.LEFT,
            fontWeight: 'bold'
        });

        if (titleObj.width + margin.LEFT * 2 > canvas.width) {
            titleObj.scaleToWidth(canvas.width - margin.LEFT - margin.RIGHT, false);
        }

        runningHeight += titleObj.getScaledHeight();
        canvas.add(titleObj);
        titleObj.centerH();


        // ----- The map -----
        map.set({
            top: runningHeight + margin.TOP,
            left: margin.LEFT
        });
        map.scaleToWidth(canvas.width * 0.75, false);
        canvas.add(map);


        // ----- The north arrow -----
        northArrow.scaleToWidth(map.getScaledWidth() * 0.035, false);
        northArrow.set({
            top: runningHeight + (margin.TOP * 1.5) + (northArrow.getScaledHeight() / 2),
            left: margin.LEFT * 2 + (northArrow.getScaledWidth() / 2)
        });
        canvas.add(northArrow);


         // ----- The scale bar -----
        scaleBar.scaleToWidth(map.getScaledWidth() * 0.10, false);
        scaleBar.set({
            top: runningHeight + map.getScaledHeight() - (scaleBar.getScaledHeight() / 1.5) - margin.BOTTOM / 2,
            left: map.getScaledWidth() - (scaleBar.getScaledWidth() / 2) - margin.LEFT * 2
        });
        canvas.add(scaleBar);


        // ----- The legend -----
        let legendTitle = new fabric.Textbox(i18n.t(`${store.datasetId}.${store.variableId}.fullName`), {
            left: margin.LEFT + 10 + map.getScaledWidth(),
            top: runningHeight + margin.TOP,
            fontFamily: 'Montserrat, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
            fill: '#000',
            fontSize: 16,
            width: (canvas.width * 0.25) - (margin.LEFT * 2),
        });
        canvas.add(legendTitle);

        let symbologyGroup = new fabric.Group();
        let symbologyGroupHeight = 0;

        if (ramp.fixture.get('legend').getLegend()[2].symbologyStack) {
            for(const item of ramp.fixture.get('legend').getLegend()[2].symbologyStack) {
                const img = await fabricImageFromURL(item.imgUrl);
                img.set({ left: 0, top: symbologyGroupHeight});
                
                // make specific icons smaller
                if (img.getScaledWidth() == 76) {
                    img.scaleToWidth(19, false);
                
                }
                symbologyGroup.addWithUpdate(img);
    
                if (item.label && item.label.length > 0) {
                    let symbolText = new fabric.Text(item.label, { 
                        left: 5 + img.getScaledWidth(),
                        top: symbologyGroupHeight + 2,
                        fontFamily: 'Montserrat, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
                        fill: '#000',
                        fontSize: 16
                    });
                    symbologyGroup.addWithUpdate(symbolText);
                }
                symbologyGroupHeight += img.getScaledHeight();
            }
    
            symbologyGroup.set({
                left: margin.LEFT + 10 + map.getScaledWidth(),
                top: runningHeight + margin.TOP + 10 + legendTitle.getScaledHeight(),
            });
            
            if (symbologyGroup.getScaledWidth() > (canvas.width * 0.25) - (margin.LEFT * 2)) {
                symbologyGroup.scaleToWidth((canvas.width * 0.25) - (margin.LEFT * 2), false);
            }
            canvas.add(symbologyGroup);
        }


        let detailsGroup = new fabric.Group();
        let detailsGroupHeight = 0;
        function newTextLine(primaryText, secondaryText) {
            let text = new fabric.Text(primaryText, { left: 0, top: detailsGroupHeight, fontFamily:
                'Montserrat, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
            fill: '#000',
            fontWeight: 'bold',
            fontSize: 14 });

            let text2 = new fabric.Text(secondaryText, { left: text.getScaledWidth(), top: detailsGroupHeight, fontFamily:
                'Montserrat, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
            fill: '#000',
            fontSize: 14 });

            detailsGroupHeight += text2.getScaledHeight() + (margin.TOP / 2);
            detailsGroup.addWithUpdate(text);
            detailsGroup.addWithUpdate(text2);

            return [text, text2];

        }


        // ----- The timeline or date -----
        if (Number.isInteger(store.timeSlice)) {
            if (store.timeSlice > 3) {
                const date = new Date(store.timeSlice);
                const d = `${i18n.t('timePeriodSelector.' + utcMonths[date.getUTCMonth()] + '.fullName')} ${date.getUTCDate()} ${date.getUTCFullYear()}, ${date.getUTCHours()}:00 UTC`;
                newTextLine(i18n.t('map.controlsCluster.timeline') + ': ', d);
            } else {
                newTextLine(i18n.t('map.controlsCluster.timeline') + ': ', timeSlices[store.timeSlice]);
            }
        }

        // ----- The time period -----
        if (store.timePeriodId) {
            newTextLine(i18n.t('timePeriodSelector.title') + ': ', i18n.t(`timePeriodSelector.${store.timePeriodId}.fullName`));
        }

        // ----- The emission scenario -----
        if (store.rcpId) {
            newTextLine(i18n.t('export.emissionScenario') + ': ', i18n.t(`rcpSelector.${store.rcpId}.veryShortName`));
        }

        // Figure out the height of all groups
        let allGroupsHeight = margin.TOP + symbologyGroup.getScaledHeight() + 10 + legendTitle.getScaledHeight();
        if (detailsGroup.getObjects().length > 0) {
            detailsGroup.set({
                left: margin.LEFT + 10 + map.getScaledWidth()
            });

            const detailsGroupWidth = (canvas.width * 0.25) - (margin.LEFT * 2);
            if (detailsGroup.getScaledWidth() > detailsGroupWidth) {
                detailsGroup.scaleToWidth(detailsGroupWidth, false);
            }

            canvas.add(detailsGroup);
            allGroupsHeight += detailsGroup.getScaledHeight();
        }

        // If the new allGroupsHeight is bigger than the map height, scale the symbologyGroup and detailsGroup proportionally so they both equal the map height
        if (allGroupsHeight > map.getScaledHeight()) {
            let scale = map.getScaledHeight() / allGroupsHeight;
            symbologyGroup.scale(scale);
            allGroupsHeight = margin.TOP + symbologyGroup.getScaledHeight() + 10 + legendTitle.getScaledHeight() + detailsGroup.getScaledHeight();
        }

        detailsGroup.set({
            top: runningHeight + (margin.TOP * 2) + symbologyGroup.getScaledHeight() + 10 + legendTitle.getScaledHeight()
        });

        // The new height is the bigger of the map height and the legend height
        runningHeight += Math.max(map.getScaledHeight(), allGroupsHeight) + margin.TOP;


        // ----- The footnote -----
        if (['cmip5','dcs', 'cmip6', 'dcs_u6'].includes(store.datasetId)) {
            let footnote = new fabric.Text(i18n.t(`export.${store.datasetId}.footnote`) + '.', {
                left: margin.LEFT,
                top: runningHeight + margin.TOP,
                fontFamily: 'Montserrat, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
                fill: '#000',
                fontSize: 14
            });

            if (footnote.width > canvas.width) {
                footnote.scaleToWidth(canvas.width - margin.LEFT, false);
            }
            canvas.add(footnote);
            runningHeight += footnote.getScaledHeight() + margin.BOTTOM;
        }

        canvas.setDimensions({
            height: runningHeight + margin.BOTTOM
        });
    }
}
