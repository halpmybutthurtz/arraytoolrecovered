// Global state
let fileData = null;
let parsedData = null;
let originalFileName = '';

// Color palette for assignments
const colorPalette = [
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Red', hex: '#DC143C' },
    { name: 'Orange', hex: '#FF8C00' },
    { name: 'Yellow', hex: '#FFD700' },
    { name: 'Green', hex: '#228B22' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Violet', hex: '#8B00FF' },
    { name: 'Gold', hex: '#DAA520' },
    { name: 'White', hex: '#FFFFFF' }
];

let selectedColor = null;

// Color assignment tracking: groupIndex -> cabinetIndex -> columnType -> { color, counter }
// columnType is 'Power', 'Data', or 'Analog'
let colorAssignments = {};

// Cable limits
const DATA_LIMIT = {
        '1 Hop' : 7,
        '2 Hops' : 6,
        '3 Hops' : 5,
        '4 Hops' : 4,
        '5 Hops' : 3
    };

// Power limits by box type
const powerLimits = {
    '230v' : {
        'VGx' : 2,
        'VGt': 3,
        'VGs': 4,
        'CS 119': 7,
        'CS119': 7,
        'CS 118': 11,
        'CS118': 11,
        'CS 7': 9,
        'CS7': 9,
        'CS 10': 9,
        'CS10': 9,
        'CS 7P': 9,
        'CS7P': 9,
        'CS 7p': 9,
        'CS7p': 9,
        'CS 10P': 9,
        'CS10P': 9,
        'CS 10p': 9,
        'CS10p': 9,
        'CS 10n': 9,
        'CS10n': 9,
        'E 15' : 3,
        'E 12' : 3,
        'E 219' : 2,
        'E 119' : 2,
        'E 218' : 3,
        'S 7' : 4,
        'S 10' : 4,
        'S 10N' : 4,
        'S 118' : 4,
        'S 119' : 2,
    },
    '208v' : {
        'VGx' : 2,
        'VGt': 3,
        'VGs': 4,
        'CS 119': 6,
        'CS119': 6,
        'CS 118': 10,
        'CS118': 10,
        'CS 7': 8,
        'CS7': 8,
        'CS 10': 8,
        'CS10': 8,
        'CS 7P': 8,
        'CS7P': 8,
        'CS 7p': 8,
        'CS7p': 8,
        'CS 10P': 8,
        'CS10P': 8,
        'CS 10p': 8,
        'CS10p': 8,
        'CS 10n': 8,
        'CS10n': 8,
        'E 15' : 3,
        'E 12' : 3,
        'E 219' : 2,
        'E 119' : 2,
        'E 218' : 3,
        'S 7' : 4,
        'S 10' : 4,
        'S 10N' : 4,
        'S 118' : 4,
        'S 119' : 2,
    },
    '120v' : {
        'VGx' : 1,
        'VGt': 2,
        'VGs': 2,
        'CS 119': 4,
        'CS119': 4,
        'CS 118': 8,
        'CS118': 8,
        'CS 7': 6,
        'CS7': 6,
        'CS 10': 6,
        'CS10': 6,
        'CS 7P': 6,
        'CS7P': 6,
        'CS 7p': 6,
        'CS7p': 6,
        'CS 10P': 6,
        'CS10P': 6,
        'CS 10p': 6,
        'CS10p': 6,
        'CS 10n': 6,
        'CS10n': 6,
        'E 15' : 3,
        'E 12' : 3,
        'E 219' : 2,
        'E 119' : 2,
        'E 218' : 3,
        'S 7' : 4,
        'S 10' : 4,
        'S 10N' : 4,
        'S 118' : 4,
        'S 119' : 2,
    },
    '100v' : {
        'VGx' : 1,
        'VGt': 2,
        'VGs': 2,
        'CS 119': 4,
        'CS119': 4,
        'CS 118': 8,
        'CS118': 8,
        'CS 7': 5,
        'CS7': 5,
        'CS 10': 5,
        'CS10': 5,
        'CS 7P': 5,
        'CS7P': 5,
        'CS 7p': 5,
        'CS7p': 5,
        'CS 10P': 5,
        'CS10P': 5,
        'CS 10p': 5,
        'CS10p': 5,
        'CS 10n': 5,
        'CS10n': 5,
        'E 15' : 3,
        'E 12' : 3,
        'E 219' : 2,
        'E 119' : 2,
        'E 218' : 3,
        'S 7' : 4,
        'S 10' : 4,
        'S 10N' : 4,
        'S 118' : 4,
        'S 119' : 2,
    },

};

let cabinetHops = {};

let cabinetVoltages = {};

//Track state of groups or cabinets
let collapsedGroups = new Set();
let collapsedCabinets = new Set();

// Bypass limits toggle per cabinet
let bypassLimits = {};

// Passive cabinets for speaker cable column
const passiveBoxTypes = [
    'E 15',
    'E 12',
    'E 219',
    'E 218',
    'E 119',
    'S 7',
    'S 10',
    'S 10N',
    'S 118',
    'S 119',
];

// Box types to exclude from display
const excludedBoxTypes = [
    //'E 15',
    //'E 12',
    //'E 219',
    //'E 218',
    //'E 119',
    //'S 7',
    //'S 10',
    //'S 10N',
    //'S 118',
    //'S 119',
    'S 7p',
    'S 10p',
    'IS7p',
    'IS10p',
    'IS 7',
    'IS 10',
    'IS 10N',
    'IS 119',
    'IS 118',
    'IS5c',
    'IS7c',
    'P 8',
    'P 12',
    'P 15',
    'A 218',
    'Y10 SUB',
    'T21 SUB',
    'SP SUB',
    'M SUB',
    'Y 10',
    'Y 18',
    'Y 10K',
    'S 8N',
    'S 8W',
    'M 8N',
    'M 8W'
];

// Valid cabinet types to import
const validCabinetTypes = ['Line Source', 'Sub Array', 'Sub'];

// DOM elements
const fileInput = document.getElementById('file-input');
const xmlInput = document.getElementById('xml-input');
const fileNameDisplay = document.getElementById('file-name');
const saveBtn = document.getElementById('save-btn');
const exportXmlBtn = document.getElementById('export-xml-btn');
const content = document.getElementById('content');

// Detect if running in Capacitor
const isCapacitor = window.Capacitor !== undefined;

async function handleExportXml() {
    if (!parsedData) {
        alert('No file loaded.');
        return;
    }

    const now = new Date();
    const dateTimeStamp = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

    const xmlDoc = document.implementation.createDocument(null, "MasterXML");
    const root = xmlDoc.documentElement;

    const metadata = xmlDoc.createElement("Metadata");
    metadata.setAttribute("originalFile", originalFileName || "unknown.bpt");
    metadata.setAttribute("exportDate", new Date().toISOString());
    metadata.setAttribute("unit", parsedData.unit || "Unknown");
    root.appendChild(metadata);

    const cabinetGroupsWrapper = xmlDoc.createElement("CabinetGroups");

    parsedData.cabinetGroups.forEach((group, groupIndex) => {
        const groupElement = xmlDoc.createElement("CabinetGroup");
        groupElement.setAttribute("index", groupIndex);
        groupElement.setAttribute("name", group.name || "");

        const groupCollapsed = collapsedGroups.has(groupIndex);
        groupElement.setAttribute("collapsed", groupCollapsed ? "true" : "false");

        group.cabinets.forEach((cabinet, cabinetIndex) => {
            const cabinetKey = `${groupIndex}-${cabinetIndex}`;
            const cabinetElement = xmlDoc.createElement("Cabinet");
            cabinetElement.setAttribute("index", cabinetIndex);
            cabinetElement.setAttribute("name", cabinet.name || "");
            cabinetElement.setAttribute("cabinetType", cabinet.cabinetType || "");
            const cabinetCollapsed = collapsedCabinets.has(cabinetKey);
            cabinetElement.setAttribute("collapsed", cabinetCollapsed ? "true" : "false");
            cabinetElement.setAttribute("bypassed", bypassLimits[cabinetKey] ? "true" : "false");
            cabinetElement.setAttribute("voltage", cabinetVoltages[cabinetKey] || "230v");
            cabinetElement.setAttribute("hop", cabinetHops[cabinetKey] || "1 Hop");
            cabinetElement.setAttribute("installationType", cabinet.installationType || "");
            cabinetElement.setAttribute("verticalAngle", cabinet.verticalAngle || "");
            cabinetElement.setAttribute("horizontalAngle", cabinet.horizontalAngle || "");
            cabinetElement.setAttribute("bottomArrayPoint", cabinet.bottomArrayPoint || "");
            cabinetElement.setAttribute("frontLoad", cabinet.frontLoad || "");
            cabinetElement.setAttribute("rearLoad", cabinet.rearLoad || "");
            cabinetElement.setAttribute("hangingType", cabinet.hangingType || "");
            cabinetElement.setAttribute("frameName", cabinet.frameName || "");
            cabinetElement.setAttribute("reference1", cabinet.reference1 || "");
            cabinetElement.setAttribute("reference2", cabinet.reference2 || "");

            cabinet.columns.forEach((column, colIndex) => {
                const columnElement = xmlDoc.createElement("Column");
                columnElement.setAttribute("index", colIndex);
                columnElement.setAttribute("name", column.name || "");

                column.boxes.forEach((box, boxIndex) => {
                    const boxElement = createBoxElement(xmlDoc, box, boxIndex);
                    columnElement.appendChild(boxElement);
                });

                cabinetElement.appendChild(columnElement);
            });

            cabinet.boxes.forEach((box, boxIndex) => {
                const boxElement = createBoxElement(xmlDoc, box, boxIndex);
                boxElement.setAttribute("isDirect", "true");
                cabinetElement.appendChild(boxElement);
            });

            groupElement.appendChild(cabinetElement);
        });

        cabinetGroupsWrapper.appendChild(groupElement);
    });

    root.appendChild(cabinetGroupsWrapper);

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    const formattedXml = formatXml(xmlString);

    const fileName = `${(originalFileName || 'export').replace(/\.[^.]+$/, '')}_master_${dateTimeStamp}.xml`;

    // Save file - mobile or desktop
    await saveFile(formattedXml, fileName, 'application/xml');
}

async function exportCabinetXml(groupIndex, cabinetIndex) {
    if (!parsedData) {
        alert('No file loaded.');
        return;
    }

    const group = parsedData.cabinetGroups[groupIndex];
    const cabinet = group.cabinets[cabinetIndex];

    const now = new Date();
    const dateTimeStamp = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

    const xmlDoc = document.implementation.createDocument(null, "CabinetXML");
    const root = xmlDoc.documentElement;
    root.setAttribute("type", "Cabinet");

    const metadata = xmlDoc.createElement("Metadata");
    metadata.setAttribute("originalFile", originalFileName || "unknown.bpt");
    metadata.setAttribute("exportDate", new Date().toISOString());
    metadata.setAttribute("unit", parsedData.unit || "Unknown");
    metadata.setAttribute("groupName", group.name || "");
    metadata.setAttribute("groupIndex", groupIndex);
    root.appendChild(metadata);

    const cabinetKey = `${groupIndex}-${cabinetIndex}`;
    const cabinetElement = xmlDoc.createElement("Cabinet");
    cabinetElement.setAttribute("index", cabinetIndex);
    cabinetElement.setAttribute("name", cabinet.name || "");
    cabinetElement.setAttribute("cabinetType", cabinet.cabinetType || "");
    cabinetElement.setAttribute("bypassed", bypassLimits[cabinetKey] ? "true" : "false");
    cabinetElement.setAttribute("installationType", cabinet.installationType || "");
    cabinetElement.setAttribute("verticalAngle", cabinet.verticalAngle || "");
    cabinetElement.setAttribute("horizontalAngle", cabinet.horizontalAngle || "");
    cabinetElement.setAttribute("bottomArrayPoint", cabinet.bottomArrayPoint || "");
    cabinetElement.setAttribute("frontLoad", cabinet.frontLoad || "");
    cabinetElement.setAttribute("rearLoad", cabinet.rearLoad || "");
    cabinetElement.setAttribute("hangingType", cabinet.hangingType || "");
    cabinetElement.setAttribute("frameName", cabinet.frameName || "");
    cabinetElement.setAttribute("reference1", cabinet.reference1 || "");
    cabinetElement.setAttribute("reference2", cabinet.reference2 || "");

    cabinet.columns.forEach((column, colIndex) => {
        const columnElement = xmlDoc.createElement("Column");
        columnElement.setAttribute("index", colIndex);
        columnElement.setAttribute("name", column.name || "");

        column.boxes.forEach((box, boxIndex) => {
            const boxElement = createBoxElement(xmlDoc, box, boxIndex);
            columnElement.appendChild(boxElement);
        });

        cabinetElement.appendChild(columnElement);
    });

    cabinet.boxes.forEach((box, boxIndex) => {
        const boxElement = createBoxElement(xmlDoc, box, boxIndex);
        boxElement.setAttribute("isDirect", "true");
        cabinetElement.appendChild(boxElement);
    });

    root.appendChild(cabinetElement);

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    const formattedXml = formatXml(xmlString);

    const cabinetName = cabinet.name ? cabinet.name.replace(/[^a-z0-9]/gi, '_') : 'cabinet';
    const fileName = `${cabinetName}_cabinet_${dateTimeStamp}.xml`;

    // Save file - mobile or desktop
    await saveFile(formattedXml, fileName, 'application/xml');
}

async function saveFile(content, fileName, mimeType) {
    console.log('saveFile called:', { fileName, isCapacitor });
    
    // MOBILE: Use Capacitor Filesystem
    if (isCapacitor) {
        try {
            console.log('Attempting Capacitor save...');
            
            // Access Capacitor plugins directly
            const { Filesystem, Directory, Encoding } = window.Capacitor.Plugins;
            
            if (!Filesystem) {
                throw new Error('Filesystem plugin not available');
            }
            
            console.log('Writing file:', fileName);
            
            const result = await Filesystem.writeFile({
                path: fileName,
                data: content,
                directory: 'DOCUMENTS',
                encoding: 'utf8'
            });
            
            console.log('File written successfully:', result);
            alert(`File saved to Documents folder:\n${fileName}`);
            return;
            
        } catch (error) {
            console.error('Capacitor save error:', error);
            alert('Error saving file:\n' + error.message + '\n\nTrying alternative method...');
            
            // Fallback: try external storage
            try {
                const { Filesystem, Directory, Encoding } = window.Capacitor.Plugins;
                
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: content,
                    directory: 'EXTERNAL_STORAGE',
                    encoding: 'utf8'
                });
                
                alert(`File saved to Downloads:\n${fileName}`);
                return;
            } catch (fallbackError) {
                console.error('Fallback save error:', fallbackError);
            }
        }
    }
    
    // DESKTOP: Use standard download method
    console.log('Using blob download (desktop)');
    try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Blob download triggered');
    } catch (error) {
        console.error('Blob download error:', error);
        alert('Error saving file:\n' + error.message);
    }
}

// File input handler
fileInput.addEventListener('change', handleFileSelect);
if (xmlInput) xmlInput.addEventListener('change', handleXmlImport);
if (saveBtn) saveBtn.addEventListener('click', handleSave);
if (exportXmlBtn) exportXmlBtn.addEventListener('click', handleExportXml);

function clearPage() {
    // Reset all data
    parsedData = null;
    fileData = null;
    originalFileName = null;
    
    // Clear all states
    collapsedGroups.clear();
    collapsedCabinets.clear();
    bypassLimits = {};
    colorAssignments = {};
    selectedColor = null;
    cabinetVoltages = {};
    cabinetHops = {};
    
    // Reset UI
    fileNameDisplay.textContent = 'No file loaded';
    if (saveBtn) saveBtn.disabled = true;
    if (exportXmlBtn) exportXmlBtn.disabled = true;
    
    // Show empty state
    content.innerHTML = `
        <div class="empty-state">
            <h2>no file loaded</h2>
        </div>
    `;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = '';

    clearPage();

    originalFileName = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        fileData = e.target.result;
        parsedData = parseBPTFile(fileData);

                collapsedGroups.clear();
        collapsedCabinets.clear();
        
        parsedData.cabinetGroups.forEach((group, gIndex) => {
            collapsedGroups.add(gIndex);
            group.cabinets.forEach((cabinet, cIndex) => {
                collapsedCabinets.add(`${gIndex}-${cIndex}`);
            });
        });

        // Update file name display with units
        const unitDisplay = parsedData.unit === 'English' ? 'Imperial' : 
                           parsedData.unit === 'Metric' ? 'Metric' : 
                           parsedData.unit || 'Unknown';
        fileNameDisplay.textContent = `Loaded: ${file.name} | Units: ${unitDisplay}`;
        
        renderContent();
        if (saveBtn) saveBtn.disabled = false;
        if (exportXmlBtn) exportXmlBtn.disabled = false;
    };
    reader.readAsText(file);
}

function parseBPTFile(content) {
    const lines = content.split('\n');
    const cabinetGroups = [];
    let currentGroup = null;
    let currentCabinet = null;
    let currentColumn = null;
    let currentBox = null;
    let inCabinetGroup = false;
    let inCabinet = false;
    let inColumn = false;
    let inBox = false;
    let unit = '';

    let foundCabinetGroups = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Capture Unit from the beginning of the file
        if (line.startsWith('Unit =')) {
            unit = line.substring(7).trim();
        }
        
        // Track when we enter the Cabinet Groups section
        if (line === '#Cabinet Groups') {
            if (foundCabinetGroups) {
                break;
            }
            foundCabinetGroups = true;
            continue;
        }
        
        // End cabinet groups when we hit these sections
        if (foundCabinetGroups && (line === '#AVB patches' || line === '#Switch names' || 
            line === '#User Data' || line === '#Display Names' || line === '#Gateway Groups' ||
            line === '#Captures')) {
            if (currentCabinet && isValidCabinetType(currentCabinet.cabinetType)) {
                if (currentColumn) {
                    currentCabinet.columns.push(currentColumn);
                    currentColumn = null;
                }
                if (currentGroup) {
                    currentGroup.cabinets.push(currentCabinet);
                }
                currentCabinet = null;
            }
            if (currentGroup) {
                cabinetGroups.push(currentGroup);
                currentGroup = null;
            }
            break;
        }
        
        if (line === '#Cabinet Group' && !line.includes('Groups')) {
            if (currentGroup && currentCabinet && isValidCabinetType(currentCabinet.cabinetType)) {
                if (currentColumn) {
                    currentCabinet.columns.push(currentColumn);
                }
                currentGroup.cabinets.push(currentCabinet);
            }
            if (currentGroup) {
                cabinetGroups.push(currentGroup);
            }
            currentGroup = { name: '', cabinets: [], startLine: i };
            currentCabinet = null;
            currentColumn = null;
            inCabinetGroup = true;
            inCabinet = false;
            inColumn = false;
        } else if (line === '#Cabinet' || (line.startsWith('#Cabinet') && !line.includes('Group'))) {
            if (currentCabinet && isValidCabinetType(currentCabinet.cabinetType)) {
                if (currentColumn) {
                    currentCabinet.columns.push(currentColumn);
                    currentColumn = null;
                }
                if (currentGroup) {
                    currentGroup.cabinets.push(currentCabinet);
                }
            }
            currentCabinet = { 
                name: '', 
                cabinetType: '',
                installationType: '',
                boxes: [], 
                columns: [], 
                startLine: i,
                // New cabinet metadata fields
                verticalAngle: '',
                horizontalAngle: '',
                bottomArrayPoint: '',
                frontLoad: '',
                rearLoad: '',
                hangingType: '',
                frameName: '',
                boxCount: 0,
                reference1: '',
                reference2: '',
                arrayLength: '',
                span: '',
                space: ''
            };
            inCabinet = true;
            inColumn = false;
        } else if (line === '#Column') {
            if (currentColumn) {
                currentCabinet.columns.push(currentColumn);
            }
            currentColumn = { name: '', boxes: [], startLine: i };
            inColumn = true;
        } else if (line.startsWith('#Box')) {
            currentBox = { 
                type: '', 
                zoneId: '', 
                startLine: i,
                displayAngle: '',
                sumAngle: '',
                preset: '',
                polarity: '',
                power: { color: null, number: null },
                data: { color: null, number: null },
                analog: { color: null, number: null },
                stackPin: false
            };
            inBox = true;
        } else if (line.startsWith('name =') && inCabinetGroup && !inCabinet) {
            currentGroup.name = line.substring(7).trim();
        } else if (line.startsWith('name =') && inCabinet && !inColumn) {
            currentCabinet.name = line.substring(7).trim();
        } else if (line.startsWith('name =') && inColumn) {
            currentColumn.name = line.substring(7).trim();
        } else if (line.startsWith('cabinetType =') && inCabinet) {
            currentCabinet.cabinetType = line.substring(14).trim();
        } else if (line.startsWith('installationType =') && inCabinet) {
            currentCabinet.installationType = line.substring(19).trim();
        } else if (line.startsWith('referenceLocation Vertical Angle =') && inCabinet) {
            currentCabinet.verticalAngle = line.substring(35).trim();
        } else if (line.startsWith('referenceLocation Horizontal Angle =') && inCabinet) {
            currentCabinet.horizontalAngle = line.substring(37).trim();
        } else if (line.startsWith('space =') && inCabinet) {
            currentCabinet.space = line.substring(8).trim();
        } else if (line.startsWith('span =') && inCabinet) {
            currentCabinet.span = line.substring(7).trim();
        } else if (line.startsWith('bottomArrayPoint =') && inCabinet) {
            const value = line.substring(18).trim();
            currentCabinet.bottomArrayPoint = value;
        } else if (line.startsWith('constraint1 =') && inCabinet) {
            currentCabinet.frontLoad = line.substring(14).trim();
        } else if (line.startsWith('constraint2 =') && inCabinet) {
            currentCabinet.rearLoad = line.substring(14).trim();
        } else if (line.startsWith('hangingType =') && inCabinet) {
            currentCabinet.hangingType = line.substring(14).trim();
        } else if (line.startsWith('frameName =') && inCabinet) {
            currentCabinet.frameName = line.substring(12).trim();
        } else if (line.startsWith('reference1 =') && inCabinet) {
            currentCabinet.reference1 = line.substring(13).trim();
        } else if (line.startsWith('reference2 =') && inCabinet) {
            currentCabinet.reference2 = line.substring(13).trim();
        } else if (line.startsWith('type =') && inBox) {
            currentBox.type = line.substring(7).trim();
        } else if (line.startsWith('zoneID =') && inBox) {
            currentBox.zoneId = line.substring(9).trim();
        } else if (line.startsWith('displayAngle =') && inBox) {
            currentBox.displayAngle = line.substring(15).trim();
        } else if (line.startsWith('sumAngle =') && inBox) {
            currentBox.sumAngle = line.substring(11).trim();
        } else if (line.startsWith('preset =') && inBox) {
            currentBox.preset = line.substring(9).trim();
        } else if (line.startsWith('polarity =') && inBox) {
            currentBox.polarity = line.substring(11).trim();
            
            // End of box - add if not excluded
            if (!excludedBoxTypes.includes(currentBox.type)) {
                if (currentColumn) {
                    currentColumn.boxes.push(currentBox);
                } else if (currentCabinet) {
                    currentCabinet.boxes.push(currentBox);
                }
            }
            currentBox = null;
            inBox = false;
        }
    }

    // Add last items only if valid cabinet type
    if (currentCabinet && isValidCabinetType(currentCabinet.cabinetType)) {
        if (currentColumn) {
            currentCabinet.columns.push(currentColumn);
        }
        if (currentGroup) {
            currentGroup.cabinets.push(currentCabinet);
        }
    }
    if (currentGroup) {
        cabinetGroups.push(currentGroup);
    }

    // Calculate box counts and array lengths
    cabinetGroups.forEach(group => {
        group.cabinets.forEach(cabinet => {
            // Count all boxes
            let totalBoxes = cabinet.boxes.length;
            cabinet.columns.forEach(col => {
                totalBoxes += col.boxes.length;
            });
            cabinet.boxCount = totalBoxes;

            // Calculate array length
            cabinet.arrayLength = calculateArrayLength(cabinet);
        });
    });

    return { cabinetGroups, rawLines: lines, unit };
}

function isValidCabinetType(cabinetType) {
    return validCabinetTypes.includes(cabinetType);
}

function calculateArrayLength(cabinet) {
    // Extract third value from reference1 and bottomArrayPoint
    const ref1Match = cabinet.reference1.match(/\(([^)]+)\)/);
    const bottomMatch = cabinet.bottomArrayPoint.match(/\(([^)]+)\)/);
    
    if (ref1Match && bottomMatch) {
        const ref1Values = ref1Match[1].split(',').map(v => parseFloat(v.trim()));
        const bottomValues = bottomMatch[1].split(',').map(v => parseFloat(v.trim()));
        
        if (ref1Values.length >= 3 && bottomValues.length >= 3) {
            const length = Math.abs(ref1Values[2] - bottomValues[2]);
            return length.toFixed(1);
        }
    }
    
    return '';
}

function extractThirdValue(vectorString) {
    const match = vectorString.match(/\(([^)]+)\)/);
    if (match) {
        const values = match[1].split(',').map(v => parseFloat(v.trim()));
        if (values.length >= 3) {
            return values[2].toFixed(1);
        }
    }
    return '';
}

function formatNumber(value) {
    // Return 'N/A' if empty or invalid
    if (value === '' || value === null || value === undefined) {
        return 'N/A';
    }
    
    // Try to parse as number
    const num = parseFloat(value);
    
    // Return 'N/A' if not a valid number
    if (isNaN(num)) {
        return value; // Return original if not a number (e.g., text values)
    }
    
    // Format to 1 decimal place
    return num.toFixed(1);
}

function changeVoltage(groupIndex, cabinetIndex, voltage) {
    const key = `${groupIndex}-${cabinetIndex}`;
    cabinetVoltages[key] = voltage;
    renderContent();
}

function changeHop(groupIndex, cabinetIndex, hop) {
    const key = `${groupIndex}-${cabinetIndex}`;
    cabinetHops[key] = hop;
    renderContent();
}

function showFramePopup(groupIndex, cabinetIndex) {
    console.log('showFramePopup called with:', groupIndex, cabinetIndex);
    
    // Get frame name from cabinet
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    const frameName = cabinet.frameName;
    
    if (!frameName || frameName === 'N/A') {
        console.log('Exiting: no valid frame name');
        return;
    }
    // Determine which image to show based on frame name
    let imageSrc = '';
    let imageAlt = '';
    
    if (frameName.includes('Regular Frame')) {
        imageSrc = 'src/regularframe.png';
        imageAlt = 'Regular Frame';
    } else if (frameName.includes('Beam Center')) {
        imageSrc = 'src/beamcenter.png';
        imageAlt = 'Beam Center';
    } else if (frameName.includes('Beam Back Option 1')) {
        imageSrc = 'src/beamback1.png';
        imageAlt = 'Beam Back Option 1';
    } else if (frameName.includes('Beam Back Option 2')) {
        imageSrc = 'src/beamback2.png';
        imageAlt = 'Beam Back Option 2';
    } else if (frameName.includes('Beam Front')) {
        imageSrc = 'src/beamfront.png';
        imageAlt = 'Beam Front';
    } else {
        // Default/generic frame image
        imageSrc = 'src/generic-frame.png';
        imageAlt = 'N/A';
    }

    // Create popup HTML
    const popupHTML = `
        <div id="frame-popup" class="frame-popup-overlay" onclick="closeFramePopup()">
            <div class="frame-popup-content" onclick="event.stopPropagation()">
                <div class="frame-popup-header">
                    <h3>${frameName}</h3>
                    <button class="frame-popup-close" onclick="closeFramePopup()">×</button>
                </div>
                <div class="frame-popup-body">
                    <img src="${imageSrc}" alt="${imageAlt}" class="frame-image" onerror="if(!this.dataset.errored){this.dataset.errored='true';this.style.display='none';document.getElementById('frame-error-msg').style.display='block';}">
                    <p id="frame-error-msg" style="display:none;color:#a0a0a0;text-align:center;padding:40px;font-size:16px;font-weight:600">no image</p>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing popup if any
    const existingPopup = document.getElementById('frame-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Add popup to body
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Add ESC key listener
    document.addEventListener('keydown', handleFramePopupEsc);
}

function handleFramePopupEsc(event) {
    if (event.key === 'Escape') {
        closeFramePopup();
    }
}

function closeFramePopup() {
    const popup = document.getElementById('frame-popup');
    if (popup) {
        popup.remove();
        document.removeEventListener('keydown', handleFramePopupEsc);
    }
}

function getLastBox(cabinet) {
    let lastBox = null;
    
    // Check columns - iterate through all columns to find the last box
    if (cabinet.columns.length > 0) {
        for (let i = cabinet.columns.length - 1; i >= 0; i--) {
            if (cabinet.columns[i].boxes.length > 0) {
                lastBox = cabinet.columns[i].boxes[cabinet.columns[i].boxes.length - 1];
                break;
            }
        }
    }
    
    // Check direct boxes - these come after columns, so they override if present
    if (cabinet.boxes.length > 0) {
        lastBox = cabinet.boxes[cabinet.boxes.length - 1];
    }
    
    return lastBox;
}

// Function to get box suffix based on preset and box number
function getBoxSuffix(preset, boxNumber) {
    if (!preset) return '';
    
    const presetUpper = preset.toUpperCase();
    
    // EF or includes "EF "
    if (presetUpper === 'EF' || presetUpper.includes('EF ')) {
        return boxNumber % 2 === 1 ? ' - Front' : ' - Back';
    }
    
    // FB or includes "FB "
    if (presetUpper === 'FB' || presetUpper.includes('FB ')) {
        return boxNumber % 2 === 1 ? ' - Front' : ' - Back';
    }
    
    // FBF or includes "FBF "
    if (presetUpper === 'FBF' || presetUpper.includes('FBF ')) {
        const backNumbers = [2, 5, 8, 11, 14, 17, 20, 23];
        return backNumbers.includes(boxNumber) ? ' - Back' : ' - Front';
    }
    
    return '';
}

function getCabinetPresetType(cabinet) {
    let firstBox = null;
    
    if (cabinet.columns.length > 0) {
        for (let i = 0; i < cabinet.columns.length; i++) {
            if (cabinet.columns[i].boxes.length > 0) {
                firstBox = cabinet.columns[i].boxes[0];
                break;
            }
        }
    }
    
    if (!firstBox && cabinet.boxes.length > 0) {
        firstBox = cabinet.boxes[0];
    }
    
    if (!firstBox || !firstBox.preset) {
        return null;
    }
    
    if (firstBox.preset.includes('EF')) {
        return 'End Fire';
    } else if (firstBox.preset.includes('FBF')) {
        return 'FBF';
    } else if (firstBox.preset.includes('FB')) {
        return 'FB';
    }
    
    return null;
}

function calculateBottomSideAngle(cabinet) {
    if (cabinet.installationType !== 'Flown') {
        return null;
    }
    
    const lastBox = getLastBox(cabinet);
    if (!lastBox) {
        return null;
    }
    
    const sumAngle = parseFloat(lastBox.sumAngle);
    if (isNaN(sumAngle)) {
        return null;
    }
    
    // Adjustments based on box type
    const boxType = lastBox.type.trim();
    let adjustment = 0;
    
    if (boxType === 'VGt') {
        adjustment = -3;
    } else if (boxType === 'CS 7' || boxType === 'CS7') {
        adjustment = -5;
    } else if (boxType === 'CS 10' || boxType === 'CS10' || boxType === 'S 10' || boxType === 'S10') {
        adjustment = -5;
    } else if (boxType === 'CS 10n' || boxType === 'CS10n' || boxType === 'S 10n' || boxType === 'S10n') {
        adjustment = -5;
    } else if (boxType === 'E 15' || boxType === 'E15') {
        adjustment = -3;
    } else if (boxType === 'E 12' || boxType === 'E12') {
        adjustment = -4;
    } else if (boxType === 'VGx') {
        adjustment = -1.5;
    }
    
    const bottomSideAngle = sumAngle + adjustment;
    return bottomSideAngle.toFixed(1);
}

function formatHangingType(hangingType) {
    if (hangingType === '0') {
        return 'Two Motors';
    } else if (hangingType === '1') {
        return 'One Motor';
    }
    return hangingType || 'N/A';
}

function calculateTotalLoad(cabinet) {
    const frontLoad = parseFloat(cabinet.frontLoad);
    const rearLoad = parseFloat(cabinet.rearLoad);
    
    if (isNaN(frontLoad) || isNaN(rearLoad)) {
        return 'N/A';
    }
    
    return (frontLoad + rearLoad).toFixed(1);
}

function calculateTotalLoad(cabinet) {
    const frontLoad = parseFloat(cabinet.frontLoad);
    const rearLoad = parseFloat(cabinet.rearLoad);
    
    if (isNaN(frontLoad) || isNaN(rearLoad)) {
        return 'N/A';
    }
    
    return (frontLoad + rearLoad).toFixed(1);
}

function calculateDistanceBetweenPoints(cabinet) {
    // Extract first value from reference1 and reference2
    const ref1Match = cabinet.reference1.match(/\(([^)]+)\)/);
    const ref2Match = cabinet.reference2.match(/\(([^)]+)\)/);
    
    if (ref1Match && ref2Match) {
        const ref1Values = ref1Match[1].split(',').map(v => parseFloat(v.trim()));
        const ref2Values = ref2Match[1].split(',').map(v => parseFloat(v.trim()));
        
        if (ref1Values.length >= 1 && ref2Values.length >= 1) {
            const distance = Math.abs(ref1Values[0] - ref2Values[0]);
            return distance.toFixed(1);
        }
    }
    
    return null;
}

// Store scroll positions by cabinet ID
const cabinetContentScrolls = new Map();

function saveAllCabinetScrolls() {
    document.querySelectorAll('.cabinet-content').forEach(element => {
        const id = element.id;
        if (id) {
            cabinetContentScrolls.set(id, {
                x: element.scrollLeft || 0,
                y: element.scrollTop || 0
            });
        }
    });
}


function restoreAllCabinetScrolls() {
    // NO requestAnimationFrame - restore immediately!
    document.querySelectorAll('.cabinet-content').forEach(element => {
        const id = element.id;
        const saved = cabinetContentScrolls.get(id);
        
        if (saved) {
            element.scrollLeft = saved.x;
            element.scrollTop = saved.y;
        }
    });
}


function _renderContentOriginal() {
    if (!parsedData || !parsedData.cabinetGroups) {
        content.innerHTML = `
            <div class="empty-state">
                <h2>no file loaded</h2>
            </div>
        `;
        return;
    }

    const hasLockedCabinet = parsedData.cabinetGroups.some(group => 
    group.cabinets.some(cabinet => cabinet.isLocked)
);

    const stats = calculateStats();

    html=``;

    if (!hasLockedCabinet){
    html = `
        <!-- Color Palette Sidebar -->
        <div class="color-palette-sidebar" id="color-palette">
            <div class="palette-header">Color Palette</div>
            ${colorPalette.map(color => `
                <div class="palette-color ${selectedColor === color.name ? 'selected' : ''}" 
                     style="background-color: ${color.hex}; ${color.name === 'White' ? 'border: 2px solid #ccc;' : ''}"
                     onclick="selectColor('${color.name}')"
                     title="${color.name}">
                </div>
            `).join('')}
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">loudspeaker groups</div>
                <div class="stat-value">${stats.groups}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">loudspeaker zones</div>
                <div class="stat-value">${stats.cabinets}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">total boxes</div>
                <div class="stat-value">${stats.boxes}</div>
            </div>
        </div>
    `;}
    else {
        html =`
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">total boxes</div>
                <div class="stat-value">${stats.boxes}</div>
            </div>
        </div>`;
    };

    parsedData.cabinetGroups.forEach((group, gIndex) => {
        const isCollapsed = collapsedGroups.has(gIndex);
        html += `
            <div class="cabinet-group">
                <div class="cabinet-group-header" onclick="toggleGroup(${gIndex})">
                    <span>${group.name || 'Unnamed Group'}</span>
                    <span class="toggle-icon" id="group-toggle-${gIndex}"><img class="arrow-icon" src="src/${isCollapsed ? 'fm-right' : 'fm-down'}.png"></span>
                </div>
                <div class="cabinet-group-content ${isCollapsed ? 'hidden' : ''}" id="group-content-${gIndex}">
        `;

        group.cabinets.forEach((cabinet, cIndex) => {
            html += renderCabinet(cabinet, gIndex, cIndex);
        });

        html += `
                </div>
            </div>
        `;
    });

    content.innerHTML = html;

}

function renderContent() {
    saveAllCabinetScrolls();
    _renderContentOriginal();
    restoreAllCabinetScrolls();
}

function renderCabinet(cabinet, groupIndex, cabinetIndex) {
    const cabinetKey = `${groupIndex}-${cabinetIndex}`;
    const isBypassed = bypassLimits[cabinetKey] || false;
    const isCollapsed = collapsedCabinets.has(cabinetKey);
    const isLocked = cabinet.isLocked || false;
    
    let html = `
        <div class="cabinet ${isLocked ? 'locked-cabinet' : ''}">
            <div class="cabinet-header" onclick="toggleCabinet(${groupIndex}, ${cabinetIndex})">
                <div>
                    ${cabinet.name || 'Unnamed Cabinet'}
                    <span class="box-type"> | ${cabinet.cabinetType}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${!isLocked ? `
                    <button class="btn-bypass ${isBypassed ? 'bypassed' : ''}" 
                            onclick="event.stopPropagation(); toggleBypassLimits(${groupIndex}, ${cabinetIndex})" title="Bypass Cable Limits"><img class="bypass-icon" alt="Bypass Cable Limits" src="src/fm-random.png"></button>
                    <button class="btn-clear-cabinet" onclick="event.stopPropagation(); clearCabinetAssignments(${groupIndex}, ${cabinetIndex})" title="Clear Cable Assignments"><img class="clear-icon" alt="Clear Cable Assignments" src="src/fm-clear.png"></button>
                    <button class="btn-export-cabinet" onclick="event.stopPropagation(); exportCabinetXml(${groupIndex}, ${cabinetIndex})" title="Export Loudspeaker XML">
                        <img class="save-icon" alt="Export Loudspeaker XML" src="src/fm-save.png">
                    </button>
                    ` : ''}
                    <span class="toggle-icon" id="cabinet-toggle-${groupIndex}-${cabinetIndex}"><img class="arrow-icon" src="src/${isCollapsed ? 'fm-right' : 'fm-down'}.png"></span>
                </div>
            </div>
            <div class="cabinet-content ${isCollapsed ? 'hidden' : ''}" id="cabinet-content-${groupIndex}-${cabinetIndex}">
    `;

    // Add cabinet metadata header
    const bottomSideAngle = calculateBottomSideAngle(cabinet);
    const isOneMotor = cabinet.hangingType === '1';
    const isTwoMotors = cabinet.hangingType === '0';
    const isFlown = cabinet.installationType === "Flown";
    const isSubArray = cabinet.cabinetType === "Sub Array";
    const distanceBetweenPoints = isTwoMotors && isFlown ? calculateDistanceBetweenPoints(cabinet) : null;
    const presetType = getCabinetPresetType(cabinet);

    const currentVoltage = cabinetVoltages[cabinetKey] || '280v';
    const currentHop = cabinetHops[cabinetKey] || '1 Hop';
    
    html += `
        <div class="cabinet-metadata">
            <div class="metadata-row">
                ${!isLocked ? `
                <div class="metadata-item">
                    <span class="metadata-label">line voltage:</span>
                    <select class="voltage-selector" title="Mains AC voltage" onchange="changeVoltage(${groupIndex}, ${cabinetIndex}, this.value)">
                        <option value="230v" ${currentVoltage === '230v' ? 'selected' : ''}>230v</option>
                        <option value="208v" ${currentVoltage === '208v' ? 'selected' : ''}>208v</option>
                        <option value="120v" ${currentVoltage === '120v' ? 'selected' : ''}>120v</option>
                        <option value="100v" ${currentVoltage === '100v' ? 'selected' : ''}>100v</option>
                    </select>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">switch hops:</span>
                    <select class="hop-selector" title="Switch hops between AVB talker and first listener" onchange="changeHop(${groupIndex}, ${cabinetIndex}, this.value)">
                        <option value="1 Hop" ${currentHop === '1 Hop' ? 'selected' : ''}>1 Hop</option>
                        <option value="2 Hops" ${currentHop === '2 Hops' ? 'selected' : ''}>2 Hops</option>
                        <option value="3 Hops" ${currentHop === '3 Hops' ? 'selected' : ''}>3 Hops</option>
                        <option value="4 Hops" ${currentHop === '4 Hops' ? 'selected' : ''}>4 Hops</option>
                        <option value="5 Hops" ${currentHop === '5 Hops' ? 'selected' : ''}>5 Hops</option>
                    </select>
                </div>
                ` : ''}
                <div class="metadata-item">
                    <span class="metadata-label">vertical angle:</span>
                    <span class="metadata-value">${formatNumber(cabinet.verticalAngle)}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">horizontal angle:</span>
                    <span class="metadata-value">${formatNumber(cabinet.horizontalAngle)}</span>
                </div>
                ${isFlown ? `
                <div class="metadata-item">
                    <span class="metadata-label">bottom array point:</span>
                    <span class="metadata-value">${extractThirdValue(cabinet.bottomArrayPoint) || 'N/A'}${parsedData.unit === "Metric" ? " m" : " ft"}</span>
                </div>
                ` : ''}
                ${bottomSideAngle ? `
                <div class="metadata-item">
                    <span class="metadata-label">bottom side angle:</span>
                    <span class="metadata-value">${bottomSideAngle}</span>
                </div>
                ` : ''}
            </div>
            <div class="metadata-row">
                ${isFlown && isOneMotor ? `
                <div class="metadata-item">
                    <span class="metadata-label">load:</span>
                    <span class="metadata-value">${calculateTotalLoad(cabinet)}${parsedData.unit === "Metric" ? " kg" : " lb"}</span>
                </div>
                ` : ''}
                ${isFlown && !isOneMotor ? `
                <div class="metadata-item">
                    <span class="metadata-label">front load:</span>
                    <span class="metadata-value">${formatNumber(cabinet.frontLoad)}${parsedData.unit === "Metric" ? " kg" : " lb"}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">rear load:</span>
                    <span class="metadata-value">${formatNumber(cabinet.rearLoad)}${parsedData.unit === "Metric" ? " kg" : " lb"}</span>
                </div>
                ` : ''}
                ${isFlown ? `
                <div class="metadata-item">
                    <span class="metadata-label">hanging type:</span>
                    <span class="metadata-value">${formatHangingType(cabinet.hangingType)}</span>
                </div>
                 ` : ''}
                ${distanceBetweenPoints && isFlown ? `
                <div class="metadata-item">
                    <span class="metadata-label">distance between points:</span>
                    <span class="metadata-value">${distanceBetweenPoints}${parsedData.unit === "Metric" ? " m" : " ft"}</span>
                </div>
                ` : ''}
            </div>
            <div class="metadata-row">
                <div class="metadata-item">
                    <span class="metadata-label">frame:</span>
                    <span class="metadata-value">${cabinet.frameName || 'N/A'}</span>
                    ${cabinet.frameName && cabinet.frameName !== 'N/A' ? `<button class="btn-frame-info" onclick="showFramePopup(${groupIndex}, ${cabinetIndex})" title="View Frame">
                        <img src="src/fm-show.png" class="info-icon" alt="Frame Info">
                    </button>` : ''}
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">array length:</span>
                    <span class="metadata-value">${cabinet.arrayLength || 'N/A'}${parsedData.unit === "Metric" ? " m" : " ft"}</span>
                </div>
                ${isSubArray ? `
                <div class="metadata-item">
                    <span class="metadata-label">sub array span:</span>
                    <span class="metadata-value">${formatNumber(cabinet.span)}${parsedData.unit === "Metric" ? " m" : " ft"}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">sub array spacing:</span>
                    <span class="metadata-value">${formatNumber(cabinet.space)}${parsedData.unit === "Metric" ? " m" : " ft"}</span>
                </div>
                ` : ''}
                ${presetType ? `
                <div class="metadata-item">
                    <span class="metadata-label">preset:</span>
                    <span class="metadata-value">${presetType}</span>
                </div>
                    ` : ''}
            </div>
        </div>
    `;

    // Render columns if they exist
    if (cabinet.columns.length > 0) {
        cabinet.columns.forEach((column, colIndex) => {
            if (column.boxes.length > 0) {
                html += `
                    <div class="column">
                        <div class="column-header">${column.name || 'Unnamed Column'}</div>
                        ${renderBoxTable(column.boxes, groupIndex, cabinetIndex, colIndex)}
                    </div>
                `;
            }
        });
    }

    // Render direct boxes if they exist
    if (cabinet.boxes.length > 0) {
        html += renderBoxTable(cabinet.boxes, groupIndex, cabinetIndex, null);
    }

    html += `
            </div>
        </div>
    `;

    return html;
}

function renderBoxTable(boxes, groupIndex, cabinetIndex, columnIndex = null) {
    if (boxes.length === 0) return '';

    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    const isLineSource = cabinet.cabinetType === 'Line Source';
    const isLocked = cabinet.isLocked || false;
    const hasPassiveBoxes = boxes.some(box => passiveBoxTypes.includes(box.type));
    
    // Check if all stack pins are on for this column/table
    const allStackPinsOn = boxes.every(box => box.stackPin);

    let html = `
        <table>
            <thead>
                <tr class="header">
                    <th style="width: 50px">#</th>
                    <th>Box</th>
                    <th>Position</th>
                    <th>Angle</th>
                    ${isLineSource && !isLocked ? `<th style="width: 60px"><button class="btn-stack-pin-toggle ${allStackPinsOn ? 'active' : ''}" onclick="event.stopPropagation(); toggleAllStackPins(${groupIndex}, ${cabinetIndex}, ${columnIndex}, ${!allStackPinsOn})">Stack</button></th>` : ''}
                    ${isLineSource && isLocked ? `<th style="width: 60px">Stack Pin</th>` : ''}
                    <th style="width: 80px">${hasPassiveBoxes ? 'NL8/NL4' : 'Power'}</th>
                    ${!hasPassiveBoxes ? `<th style="width: 80px">Data</th>` : ''}
                    ${!hasPassiveBoxes ? `<th style="width: 80px">Analog</th>` : ''}
                    ${!isLocked && !hasPassiveBoxes ? '<th style="width: 60px">Hybrid</th>' : ''}
                </tr>
            </thead>
            <tbody>
    `;

    boxes.forEach((box, boxIndex) => {
        const boxSuffix = getBoxSuffix(box.preset, boxIndex + 1);

        
        // Create circle HTML for cable assignments
        const powerCircle = box.power.color 
            ? `<div class="cable-circle" style="background-color: ${getColorHex(box.power.color)}; color: ${box.power.color === 'White' ? '#333' : 'white'};">${box.power.number || ''}</div>`
            : '';
        const dataCircle = box.data.color 
            ? `<div class="cable-circle" style="background-color: ${getColorHex(box.data.color)}; color: ${box.data.color === 'White' ? '#333' : 'white'};">${box.data.number || ''}</div>`
            : '';
        const analogCircle = box.analog.color 
            ? `<div class="cable-circle" style="background-color: ${getColorHex(box.analog.color)}; color: ${box.analog.color === 'White' ? '#333' : 'white'};">${box.analog.number || ''}</div>`
            : '';
        
        html += `
            <tr>
                <td>${boxIndex + 1}</td>
                <td>${box.type}${boxSuffix}</td>
                <td>${formatNumber(box.displayAngle)}</td>
                <td>${formatNumber(box.sumAngle)}</td>
                ${isLineSource && !isLocked ? '<td class="stack-pin-cell"><input type="checkbox" ' + (box.stackPin ? 'checked' : '') + ' onchange="toggleStackPin(' + groupIndex + ',' + cabinetIndex + ',' + columnIndex + ',' + boxIndex + ')"></td>' : ''}
                ${isLineSource && isLocked ? '<td class="stack-pin-cell"><div class="stack-pin-indicator ' + (box.stackPin ? 'active' : '') + '"></div></td>' : ''}
                <td class="cable-cell ${isLocked ? 'locked-cell' : ''}" ${!isLocked ? `onclick="assignColor(${groupIndex}, ${cabinetIndex}, ${columnIndex}, ${boxIndex}, 'power')"` : ''}>
                    ${powerCircle}
                </td>
                ${!hasPassiveBoxes ? `<td class="cable-cell ${isLocked ? 'locked-cell' : ''}" ${!isLocked ? `onclick="assignColor(${groupIndex}, ${cabinetIndex}, ${columnIndex}, ${boxIndex}, 'data')"` : ''}>
                    ${dataCircle}
                </td>` : ''}
                ${!hasPassiveBoxes ? `<td class="cable-cell ${isLocked ? 'locked-cell' : ''}" ${!isLocked ? `onclick="assignColor(${groupIndex}, ${cabinetIndex}, ${columnIndex}, ${boxIndex}, 'analog')"` : ''}>
                    ${analogCircle}
                </td>` : ''}
                ${!isLocked && !hasPassiveBoxes ? `<td class="cable-cell hybrid-cell" 
                    onclick="assignHybrid(${groupIndex}, ${cabinetIndex}, ${columnIndex}, ${boxIndex})">
                    <img src="src/fm-group-w.png" class="hybrid-btn">
                </td>` : ''}
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}

function toggleGroup(groupIndex) {
    const content = document.getElementById(`group-content-${groupIndex}`);
    const icon = document.getElementById(`group-toggle-${groupIndex}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.innerHTML = '<img class="arrow-icon" src="src/fm-down.png">';
        collapsedGroups.delete(groupIndex); 
    } else {
        content.classList.add('hidden');
        icon.innerHTML = '<img class="arrow-icon" src="src/fm-right.png">';
        collapsedGroups.add(groupIndex); 
    }
}

function toggleCabinet(groupIndex, cabinetIndex) {
    const cabinetKey = `${groupIndex}-${cabinetIndex}`; 
    const content = document.getElementById(`cabinet-content-${groupIndex}-${cabinetIndex}`);
    const icon = document.getElementById(`cabinet-toggle-${groupIndex}-${cabinetIndex}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.innerHTML = `<img class="arrow-icon" src="src/fm-down.png">`;
        collapsedCabinets.delete(cabinetKey);
    } else {
        content.classList.add('hidden');
        icon.innerHTML = `<img class="arrow-icon" src="src/fm-right.png">`;
        collapsedCabinets.add(cabinetKey);
    }
}

function calculateStats() {
    if (!parsedData) return { groups: 0, cabinets: 0, boxes: 0 };

    let totalCabinets = 0;
    let totalBoxes = 0;

    parsedData.cabinetGroups.forEach(group => {
        totalCabinets += group.cabinets.length;
        group.cabinets.forEach(cabinet => {
            totalBoxes += cabinet.boxCount;
        });
    });

    return {
        groups: parsedData.cabinetGroups.length,
        cabinets: totalCabinets,
        boxes: totalBoxes
    };
}

function selectColor(colorName) {
    selectedColor = colorName;
    renderContent();
}

//Color Hotkeys
document.addEventListener('keydown', (event) => {
    if (event.key >= '1' && event.key <= '9') {
        const colorIndex = parseInt(event.key) - 1;
        
        if (colorIndex < colorPalette.length) {
            const color = colorPalette[colorIndex];
            selectColor(color.name); 
            event.preventDefault(); 
        }
    }
});

function getColorHex(colorName) {
    const color = colorPalette.find(c => c.name === colorName);
    return color ? color.hex : '#CCCCCC';
}

function getBox(groupIndex, cabinetIndex, columnIndex, boxIndex) {
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    if (columnIndex !== null) {
        return cabinet.columns[columnIndex].boxes[boxIndex];
    } else {
        return cabinet.boxes[boxIndex];
    }
}

function initializeCabinetCounters(groupIndex, cabinetIndex) {
    const key = `${groupIndex}-${cabinetIndex}`;
    if (!colorAssignments[key]) {
        colorAssignments[key] = {
            'Power': {},
            'Data': {},
            'Analog': {}
        };
        
        // Initialize counters for each color
        colorPalette.forEach(color => {
            colorAssignments[key]['Power'][color.name] = 0;
            colorAssignments[key]['Data'][color.name] = 0;
            colorAssignments[key]['Analog'][color.name] = 0;
        });
    }
}

function getNextAvailableNumber(groupIndex, cabinetIndex, cableType, color) {
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    const usedNumbers = new Set();
    
    // Collect all used numbers for this color and cable type in this cabinet
    const checkBoxes = (boxes) => {
        boxes.forEach(box => {
            if (box[cableType].color === color && box[cableType].number) {
                usedNumbers.add(box[cableType].number);
            }
        });
    };
    
    // Check all columns
    cabinet.columns.forEach(column => {
        checkBoxes(column.boxes);
    });
    
    // Check direct boxes
    checkBoxes(cabinet.boxes);
    
    // Find the next available number
    if (usedNumbers.size === 0) {
        return 1; // No assignments, start at 1
    }
    
    let nextNumber = 1;
    while (usedNumbers.has(nextNumber)) {
        nextNumber++;
    }
    
    return nextNumber;
}

function countColorAssignments(groupIndex, cabinetIndex, cableType, color) {
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    let count = 0;
    
    const checkBoxes = (boxes) => {
        boxes.forEach(box => {
            if (box[cableType].color === color) {
                count++;
            }
        });
    };
    
    // Check all columns
    cabinet.columns.forEach(column => {
        checkBoxes(column.boxes);
    });
    
    // Check direct boxes
    checkBoxes(cabinet.boxes);
    
    return count;
}

function getPowerLimitForBox(boxType, groupIndex, cabinetIndex) {
    const voltage = cabinetVoltages[`${groupIndex}-${cabinetIndex}`] || '230v';
    const limitsForVoltage = powerLimits[voltage] || powerLimits['230v']; 
    return limitsForVoltage[boxType] || 8;
}

function checkDataLimit(groupIndex, cabinetIndex, color) {
    const count = countColorAssignments(groupIndex, cabinetIndex, 'data', color);
    
    const cabinetKey = `${groupIndex}-${cabinetIndex}`;
    const hop = cabinetHops[cabinetKey] || '1 Hop';
    
    const limit = DATA_LIMIT[hop] || 6;
    
    return count < limit;
}

function checkPowerLimit(groupIndex, cabinetIndex, color, boxType) {
    const count = countColorAssignments(groupIndex, cabinetIndex, 'power', color);
    const limit = getPowerLimitForBox(boxType, groupIndex, cabinetIndex);
    return count < limit;
}

function toggleBypassLimits(groupIndex, cabinetIndex) {
    const key = `${groupIndex}-${cabinetIndex}`;
    bypassLimits[key] = !bypassLimits[key];
    renderContent();
}

function assignColor(groupIndex, cabinetIndex, columnIndex, boxIndex, cableType) {
    if (!selectedColor) {
        selectedColor = "Brown";
        //alert('Please select a color from the palette first');
    }
    
    initializeCabinetCounters(groupIndex, cabinetIndex);
    const box = getBox(groupIndex, cabinetIndex, columnIndex, boxIndex);
    const cabinetKey = `${groupIndex}-${cabinetIndex}`;
    const isBypassed = bypassLimits[cabinetKey] || false;
    
    // Check if this cell already has the selected color assigned
    if (box[cableType].color === selectedColor) {
        // Clear the assignment
        box[cableType].color = null;
        box[cableType].number = null;
    } else {
        // Check limits only if not bypassed
        if (!isBypassed) {
            // Check data limit
            if (cableType === 'data') {
                if (!checkDataLimit(groupIndex, cabinetIndex, selectedColor)) {
                    alert('AVB MSRP exceeded');
                    return;
                }
            }
            
            // Check power limit
            if (cableType === 'power') {
                if (!checkPowerLimit(groupIndex, cabinetIndex, selectedColor, box.type)) {
                    alert('Circuit limit exceeded');
                    return;
                }
            }
        }
        
        // Get next available number for this color and cable type
        const nextNumber = getNextAvailableNumber(groupIndex, cabinetIndex, cableType, selectedColor);
        box[cableType].color = selectedColor;
        box[cableType].number = nextNumber;
    }
    
    renderContent();
}

function clearCabinetAssignments(groupIndex, cabinetIndex) {
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    
    const clearBoxes = (boxes) => {
        boxes.forEach(box => {
            box.power.color = null;
            box.power.number = null;
            box.data.color = null;
            box.data.number = null;
            box.analog.color = null;
            box.analog.number = null;
        });
    };
    
    // Clear all columns
    cabinet.columns.forEach(column => {
        clearBoxes(column.boxes);
    });
    
    // Clear direct boxes
    clearBoxes(cabinet.boxes);
    
    // Reset counters for this cabinet
    const key = `${groupIndex}-${cabinetIndex}`;
    if (colorAssignments[key]) {
        colorPalette.forEach(color => {
            colorAssignments[key]['Power'][color.name] = 0;
            colorAssignments[key]['Data'][color.name] = 0;
            colorAssignments[key]['Analog'][color.name] = 0;
        });
    }
    
    renderContent();
}

function assignHybrid(groupIndex, cabinetIndex, columnIndex, boxIndex) {
    if (!selectedColor) {
        selectedColor = "Brown"
        //alert('Please select a color from the palette first');
        return;
    }
    
    initializeCabinetCounters(groupIndex, cabinetIndex);
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    const box = getBox(groupIndex, cabinetIndex, columnIndex, boxIndex);
    const cabinetKey = `${groupIndex}-${cabinetIndex}`;
    const isBypassed = bypassLimits[cabinetKey] || false;
    
    // Check if this row already has the selected color in all three columns
    const allThreeHaveSelectedColor = 
        box.power.color === selectedColor && 
        box.data.color === selectedColor && 
        box.analog.color === selectedColor;
    
    if (allThreeHaveSelectedColor) {
        // Clear all three assignments
        box.power.color = null;
        box.power.number = null;
        box.data.color = null;
        box.data.number = null;
        box.analog.color = null;
        box.analog.number = null;
        
        renderContent();
        return;
    }
    
    // Check limits only if not bypassed
    if (!isBypassed) {
        // Check data limit
        if (!checkDataLimit(groupIndex, cabinetIndex, selectedColor)) {
            alert('AVB MSRP exceeded');
            return;
        }
        
        // Check power limit
        if (!checkPowerLimit(groupIndex, cabinetIndex, selectedColor, box.type)) {
            alert('Circuit limit exceeded');
            return;
        }
    }
    
    // Otherwise, proceed with normal hybrid assignment
    // Clear any rows in this cabinet that have the selected color but not in all 3 columns
    const clearPartialAssignments = (boxes) => {
        boxes.forEach(b => {
            const hasSelectedColor = 
                b.power.color === selectedColor || 
                b.data.color === selectedColor || 
                b.analog.color === selectedColor;
            
            const allThreeSameColor = 
                b.power.color === selectedColor && 
                b.data.color === selectedColor && 
                b.analog.color === selectedColor;
            
            // If box has the selected color but not in all three columns, clear those assignments
            if (hasSelectedColor && !allThreeSameColor) {
                if (b.power.color === selectedColor) {
                    b.power.color = null;
                    b.power.number = null;
                }
                if (b.data.color === selectedColor) {
                    b.data.color = null;
                    b.data.number = null;
                }
                if (b.analog.color === selectedColor) {
                    b.analog.color = null;
                    b.analog.number = null;
                }
            }
        });
    };
    
    // Clear partial assignments in all columns
    cabinet.columns.forEach(column => {
        clearPartialAssignments(column.boxes);
    });
    
    // Clear partial assignments in direct boxes
    clearPartialAssignments(cabinet.boxes);
    
    // Get next available numbers for each cable type
    const powerNumber = getNextAvailableNumber(groupIndex, cabinetIndex, 'power', selectedColor);
    const dataNumber = getNextAvailableNumber(groupIndex, cabinetIndex, 'data', selectedColor);
    const analogNumber = getNextAvailableNumber(groupIndex, cabinetIndex, 'analog', selectedColor);
    
    // Use the highest number among the three to keep them in sync
    const syncNumber = Math.max(powerNumber, dataNumber, analogNumber);
    
    // Assign same color and synced number to all three for the clicked row
    box.power.color = selectedColor;
    box.power.number = syncNumber;
    box.data.color = selectedColor;
    box.data.number = syncNumber;
    box.analog.color = selectedColor;
    box.analog.number = syncNumber;
    
    renderContent();
}

function toggleStackPin(groupIndex, cabinetIndex, columnIndex, boxIndex) {
    const box = getBox(groupIndex, cabinetIndex, columnIndex, boxIndex);
    box.stackPin = !box.stackPin;
    renderContent();
}

function toggleAllStackPins(groupIndex, cabinetIndex, columnIndex, checked) {
    const cabinet = parsedData.cabinetGroups[groupIndex].cabinets[cabinetIndex];
    let boxes = [];
    
    if (columnIndex !== null) {
        // Get boxes from specific column
        boxes = cabinet.columns[columnIndex].boxes;
    } else {
        // Get direct boxes
        boxes = cabinet.boxes;
    }
    
    // Check if all are currently on
    const allOn = boxes.every(box => box.stackPin);
    
    // If all are on, turn them all off regardless of checked state
    // Otherwise, set them to the checked state
    const newState = allOn ? false : checked;
    
    boxes.forEach(box => {
        box.stackPin = newState;
    });
    
    renderContent();
}

function handleSave() {
    if (!fileData || !parsedData) {
        alert('No file loaded to save.');
        return;
    }

    // For now, just save the original file
    // In the future, we can implement editing functionality
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFileName || 'modified.bpt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/*function handleExportXml() {
    if (!parsedData) {
        alert('No file loaded to export.');
        return;
    }

    // Create XML document
    const xmlDoc = document.implementation.createDocument(null, "MasterXML");
    const root = xmlDoc.documentElement;

        //Create Readable datestamp
        const now = new Date();
        const dateTimeStamp = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');
    
    // Add metadata
    const metadata = xmlDoc.createElement("Metadata");
    metadata.setAttribute("originalFile", originalFileName || "unknown.bpt");
    metadata.setAttribute("exportDate", new Date().toISOString());
    metadata.setAttribute("unit", parsedData.unit || "Unknown");
    root.appendChild(metadata);
    
    // Add cabinet groups
    const cabinetGroupsElement = xmlDoc.createElement("CabinetGroups");
    
    parsedData.cabinetGroups.forEach((group, gIndex) => {
        const groupElement = xmlDoc.createElement("CabinetGroup");
        groupElement.setAttribute("index", gIndex);
        groupElement.setAttribute("name", group.name || "");
        groupElement.setAttribute("collapsed", collapsedGroups.has(gIndex) ? "true" : "false");
        
        // Add cabinets
        group.cabinets.forEach((cabinet, cIndex) => {
            const cabinetKey = `${gIndex}-${cIndex}`;
            const cabinetElement = xmlDoc.createElement("Cabinet");
            cabinetElement.setAttribute("index", cIndex);
            cabinetElement.setAttribute("name", cabinet.name || "");
            cabinetElement.setAttribute("cabinetType", cabinet.cabinetType || "");
            cabinetElement.setAttribute("collapsed", collapsedCabinets.has(cabinetKey) ? "true" : "false");
            cabinetElement.setAttribute("bypassed", bypassLimits[cabinetKey] ? "true" : "false");
            
            // Add all cabinet metadata
            cabinetElement.setAttribute("voltage", cabinetVoltages[cabinetKey] || "230v");
            cabinetElement.setAttribute("hop", cabinetHops[cabinetKey] || "1 Hop");
            cabinetElement.setAttribute("installationType", cabinet.installationType || "");
            cabinetElement.setAttribute("verticalAngle", cabinet.verticalAngle || "");
            cabinetElement.setAttribute("horizontalAngle", cabinet.horizontalAngle || "");
            cabinetElement.setAttribute("bottomArrayPoint", cabinet.bottomArrayPoint || "");
            cabinetElement.setAttribute("frontLoad", cabinet.frontLoad || "");
            cabinetElement.setAttribute("rearLoad", cabinet.rearLoad || "");
            cabinetElement.setAttribute("hangingType", cabinet.hangingType || "");
            cabinetElement.setAttribute("frameName", cabinet.frameName || "");
            cabinetElement.setAttribute("reference1", cabinet.reference1 || "");
            cabinetElement.setAttribute("reference2", cabinet.reference2 || "");

            
            // Add columns
            cabinet.columns.forEach((column, colIndex) => {
                const columnElement = xmlDoc.createElement("Column");
                columnElement.setAttribute("index", colIndex);
                columnElement.setAttribute("name", column.name || "");
                
                // Add boxes in column
                column.boxes.forEach((box, boxIndex) => {
                    const boxElement = createBoxElement(xmlDoc, box, boxIndex);
                    columnElement.appendChild(boxElement);
                });
                
                cabinetElement.appendChild(columnElement);
            });
            
            // Add direct boxes
            cabinet.boxes.forEach((box, boxIndex) => {
                const boxElement = createBoxElement(xmlDoc, box, boxIndex);
                boxElement.setAttribute("isDirect", "true");
                cabinetElement.appendChild(boxElement);
            });
            
            groupElement.appendChild(cabinetElement);
        });
        
        cabinetGroupsElement.appendChild(groupElement);
    });
    
    root.appendChild(cabinetGroupsElement);
    
    // Serialize XML
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    
    // Format XML with indentation
    const formattedXml = formatXml(xmlString);
    
    // Download
    const blob = new Blob([formattedXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = originalFileName ? originalFileName.replace('.bpt', '') : 'export';
    a.download = `${baseName}_master_${dateTimeStamp}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    //alert('Master XML exported successfully!');
}*/

function createBoxElement(xmlDoc, box, boxIndex) {
    const boxElement = xmlDoc.createElement("Box");
    boxElement.setAttribute("index", boxIndex);
    boxElement.setAttribute("type", box.type || "");
    boxElement.setAttribute("zoneId", box.zoneId || "");
    boxElement.setAttribute("preset", box.preset || "");
    boxElement.setAttribute("displayAngle", box.displayAngle || "");
    boxElement.setAttribute("sumAngle", box.sumAngle || "");
    boxElement.setAttribute("stackPin", box.stackPin ? "true" : "false");
    
    // Add cable assignments
    if (box.power.color) {
        boxElement.setAttribute("powerColor", box.power.color);
        boxElement.setAttribute("powerNumber", box.power.number);
    }
    if (box.data.color) {
        boxElement.setAttribute("dataColor", box.data.color);
        boxElement.setAttribute("dataNumber", box.data.number);
    }
    if (box.analog.color) {
        boxElement.setAttribute("analogColor", box.analog.color);
        boxElement.setAttribute("analogNumber", box.analog.number);
    }
    
    return boxElement;
}

function formatXml(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;
    
    xml = xml.replace(reg, '$1\n$2$3');
    
    xml.split('\n').forEach(function(node) {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }
        
        formatted += PADDING.repeat(pad) + node + '\n';
        pad += indent;
    });
    
    return formatted.trim();
}

function handleXmlImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = '';

    clearPage();
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const xmlString = e.target.result;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            
            // Check for parsing errors
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                alert('Error parsing XML file. Please check the file format.');
                return;
            }
            
            // Detect XML type
            const root = xmlDoc.documentElement;
            const xmlType = root.getAttribute("type");
            
            if (xmlType === "Cabinet") {
                // Handle Cabinet XML import
                importCabinetXml(xmlDoc, file);
            } else {
                // Handle Master XML import
                importMasterXml(xmlDoc, file);
            }
            
        } catch (error) {
            console.error('Error importing XML:', error);
            alert('Error loading XML: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function importMasterXml(xmlDoc, file) {
    if (!file) {
        console.error("importMasterXml called without file parameter");
        alert("Error: Missing file information");
        return;
    }
    
    // Extract metadata
    const metadata = xmlDoc.getElementsByTagName("Metadata")[0];
    const originalFile = metadata.getAttribute("originalFile");
    const unit = metadata.getAttribute("unit");
    
    // Create empty parsedData structure
    parsedData = {
        cabinetGroups: [],
        rawLines: [],
        unit: unit
    };
    
    // Clear states
    collapsedGroups.clear();
    collapsedCabinets.clear();
    bypassLimits = {};
    
    // Parse cabinet groups
    const cabinetGroupsElement = xmlDoc.getElementsByTagName("CabinetGroups")[0];
    const groupElements = cabinetGroupsElement.getElementsByTagName("CabinetGroup");
            
            for (let gIndex = 0; gIndex < groupElements.length; gIndex++) {
                const groupElement = groupElements[gIndex];
                const group = {
                    name: groupElement.getAttribute("name"),
                    cabinets: [],
                    startLine: 0
                };
                
                // Restore collapsed state
                if (groupElement.getAttribute("collapsed") === "true") {
                    collapsedGroups.add(gIndex);
                }
                
                // Parse cabinets
                const cabinetElements = groupElement.getElementsByTagName("Cabinet");
                for (let cIndex = 0; cIndex < cabinetElements.length; cIndex++) {
                    const cabinetElement = cabinetElements[cIndex];
                    const cabinetKey = `${gIndex}-${cIndex}`;
                    
                    const cabinet = {
                        name: cabinetElement.getAttribute("name"),
                        cabinetType: cabinetElement.getAttribute("cabinetType"),
                        installationType: cabinetElement.getAttribute("installationType"),
                        verticalAngle: cabinetElement.getAttribute("verticalAngle"),
                        horizontalAngle: cabinetElement.getAttribute("horizontalAngle"),
                        bottomArrayPoint: cabinetElement.getAttribute("bottomArrayPoint"),
                        frontLoad: cabinetElement.getAttribute("frontLoad"),
                        rearLoad: cabinetElement.getAttribute("rearLoad"),
                        hangingType: cabinetElement.getAttribute("hangingType"),
                        frameName: cabinetElement.getAttribute("frameName"),
                        reference1: cabinetElement.getAttribute("reference1"),
                        reference2: cabinetElement.getAttribute("reference2"),
                        boxes: [],
                        columns: [],
                        startLine: 0,
                        boxCount: 0,
                        arrayLength: ''
                    };
                    
                    // Restore collapsed state
                    if (cabinetElement.getAttribute("collapsed") === "true") {
                        collapsedCabinets.add(cabinetKey);
                    }
                    
                    // Restore bypass state
                    if (cabinetElement.getAttribute("bypassed") === "true") {
                        bypassLimits[cabinetKey] = true;
                    }

                    const voltage = cabinetElement.getAttribute("voltage");
                    if (voltage) {
                        cabinetVoltages[cabinetKey] = voltage;
                    }

                    const hop = cabinetElement.getAttribute("hop");
                    if (hop) {
                        cabinetHops[cabinetKey] = hop;
                    }
                    
                    // Parse columns
                    const columnElements = cabinetElement.getElementsByTagName("Column");
                    for (let colIndex = 0; colIndex < columnElements.length; colIndex++) {
                        const columnElement = columnElements[colIndex];
                        const column = {
                            name: columnElement.getAttribute("name"),
                            boxes: [],
                            startLine: 0
                        };
                        
                        // Parse boxes in column
                        const boxElements = columnElement.getElementsByTagName("Box");
                        for (let boxIndex = 0; boxIndex < boxElements.length; boxIndex++) {
                            const box = parseBoxElement(boxElements[boxIndex]);
                            column.boxes.push(box);
                        }
                        
                        cabinet.columns.push(column);
                    }
                    
                    // Parse direct boxes (child boxes of Cabinet, not in Column)
                    const directBoxes = Array.from(cabinetElement.children).filter(child => 
                        child.tagName === "Box" && child.getAttribute("isDirect") === "true"
                    );
                    
                    directBoxes.forEach(boxElement => {
                        const box = parseBoxElement(boxElement);
                        cabinet.boxes.push(box);
                    });
                    
                    // Calculate box count
                    let totalBoxes = cabinet.boxes.length;
                    cabinet.columns.forEach(col => {
                        totalBoxes += col.boxes.length;
                    });
                    cabinet.boxCount = totalBoxes;
                    cabinet.arrayLength = calculateArrayLength(cabinet);
                    
                    group.cabinets.push(cabinet);
                }
                
                parsedData.cabinetGroups.push(group);
            }
            
            // Update UI
            const unitDisplay = unit === 'English' ? 'Imperial' : 
                              unit === 'Metric' ? 'Metric' : 
                              unit || 'Unknown';
            fileNameDisplay.textContent = `Loaded: ${file.name} (Master XML from ${originalFile}) | Units: ${unitDisplay}`;
            
            renderContent();
            if (exportXmlBtn) exportXmlBtn.disabled = false;
            
            //alert('Master XML loaded successfully!');
}

function importCabinetXml(xmlDoc, file) {
    // Extract metadata
    const metadata = xmlDoc.getElementsByTagName("Metadata")[0];
    if (!metadata) {
        alert('Invalid Cabinet XML: Missing metadata');
        return;
    }
    
    const originalFile = metadata.getAttribute("originalFile");
    const unit = metadata.getAttribute("unit");
    const groupName = metadata.getAttribute("groupName") || "Imported Cabinets";
    
    console.log("Importing Cabinet XML - groupName:", groupName);
    
    // Initialize parsedData if it doesn't exist
    if (!parsedData) {
        parsedData = {
            cabinetGroups: [],
            rawLines: [],
            unit: unit
        };
    }
    
    // Parse cabinet element
    const cabinetElement = xmlDoc.getElementsByTagName("Cabinet")[0];
    if (!cabinetElement) {
        alert('Invalid Cabinet XML: Missing cabinet element');
        return;
    }
    
    const cabinet = {
        name: cabinetElement.getAttribute("name"),
        cabinetType: cabinetElement.getAttribute("cabinetType"),
        installationType: cabinetElement.getAttribute("installationType"),
        verticalAngle: cabinetElement.getAttribute("verticalAngle"),
        horizontalAngle: cabinetElement.getAttribute("horizontalAngle"),
        bottomArrayPoint: cabinetElement.getAttribute("bottomArrayPoint"),
        frontLoad: cabinetElement.getAttribute("frontLoad"),
        rearLoad: cabinetElement.getAttribute("rearLoad"),
        hangingType: cabinetElement.getAttribute("hangingType"),
        frameName: cabinetElement.getAttribute("frameName"),
        reference1: cabinetElement.getAttribute("reference1"),
        reference2: cabinetElement.getAttribute("reference2"),
        boxes: [],
        columns: [],
        startLine: 0,
        boxCount: 0,
        arrayLength: '',
        isLocked: true  // Cabinet XMLs are always locked
    };
    
    // Parse columns
    const columnElements = cabinetElement.getElementsByTagName("Column");
    for (let colIndex = 0; colIndex < columnElements.length; colIndex++) {
        const columnElement = columnElements[colIndex];
        const column = {
            name: columnElement.getAttribute("name"),
            boxes: [],
            startLine: 0
        };
        
        // Parse boxes in column
        const boxElements = columnElement.getElementsByTagName("Box");
        for (let boxIndex = 0; boxIndex < boxElements.length; boxIndex++) {
            const box = parseBoxElement(boxElements[boxIndex]);
            column.boxes.push(box);
        }
        
        cabinet.columns.push(column);
    }
    
    // Parse direct boxes
    const directBoxes = Array.from(cabinetElement.children).filter(child => 
        child.tagName === "Box" && child.getAttribute("isDirect") === "true"
    );
    
    directBoxes.forEach(boxElement => {
        const box = parseBoxElement(boxElement);
        cabinet.boxes.push(box);
    });
    
    // Calculate box count
    let totalBoxes = cabinet.boxes.length;
    cabinet.columns.forEach(col => {
        totalBoxes += col.boxes.length;
    });
    cabinet.boxCount = totalBoxes;
    cabinet.arrayLength = calculateArrayLength(cabinet);
    
    // Find or create cabinet group
    const finalGroupName = groupName || "Imported Cabinets";
    let groupIndex = parsedData.cabinetGroups.findIndex(g => g && g.name === finalGroupName);
    if (groupIndex === -1) {
        // Create new group
        parsedData.cabinetGroups.push({
            name: finalGroupName,
            cabinets: [],
            startLine: 0
        });
        groupIndex = parsedData.cabinetGroups.length - 1;
    }
    
    // Add cabinet to group
    parsedData.cabinetGroups[groupIndex].cabinets.push(cabinet);
    
    // Update UI
    const unitDisplay = unit === 'English' ? 'Imperial' : 
                      unit === 'Metric' ? 'Metric' : 
                      unit || 'Unknown';
    fileNameDisplay.textContent = `Loaded: ${file.name} (Cabinet XML) | Units: ${unitDisplay}`;
    
    renderContent();
    if (exportXmlBtn) exportXmlBtn.disabled = false;
    
    alert('Read-only array data loaded');
}

function parseBoxElement(boxElement) {
    const box = {
        type: boxElement.getAttribute("type") || "",
        zoneId: boxElement.getAttribute("zoneId") || "",
        preset: boxElement.getAttribute("preset") || "",
        displayAngle: boxElement.getAttribute("displayAngle") || "",
        sumAngle: boxElement.getAttribute("sumAngle") || "",
        stackPin: boxElement.getAttribute("stackPin") === "true",
        startLine: 0,
        power: { color: null, number: null },
        data: { color: null, number: null },
        analog: { color: null, number: null }
    };
    
    // Restore cable assignments
    if (boxElement.hasAttribute("powerColor")) {
        box.power.color = boxElement.getAttribute("powerColor");
        box.power.number = parseInt(boxElement.getAttribute("powerNumber"));
    }
    if (boxElement.hasAttribute("dataColor")) {
        box.data.color = boxElement.getAttribute("dataColor");
        box.data.number = parseInt(boxElement.getAttribute("dataNumber"));
    }
    if (boxElement.hasAttribute("analogColor")) {
        box.analog.color = boxElement.getAttribute("analogColor");
        box.analog.number = parseInt(boxElement.getAttribute("analogNumber"));
    }
    
    return box;
}

// ============================================================
// DEBUG CODE - Add this temporarily to find the scroll reset cause
// ============================================================

// Monitor scroll changes
const contentElement = document.getElementById('content');

if (contentElement) {
    let lastScrollX = 0;
    let lastScrollY = 0;
    
    contentElement.addEventListener('scroll', function() {
        console.log('Scroll changed:', {
            x: this.scrollLeft,
            y: this.scrollTop,
            xDelta: this.scrollLeft - lastScrollX,
            yDelta: this.scrollTop - lastScrollY
        });
        lastScrollX = this.scrollLeft;
        lastScrollY = this.scrollTop;
    });
    
    // Track when scroll resets to 0
    const observer = new MutationObserver(function() {
        if (contentElement.scrollLeft === 0 && lastScrollX !== 0) {
            console.error('❌ SCROLL RESET DETECTED!');
            console.trace('Stack trace:');
        }
    });
    
    observer.observe(contentElement, {
        childList: true,
        subtree: true,
        attributes: true
    });
}

/*function exportCabinetXml(groupIndex, cabinetIndex) {
    if (!parsedData) {
        alert('No file loaded.');
        return;
    }

    const group = parsedData.cabinetGroups[groupIndex];
    const cabinet = group.cabinets[cabinetIndex];

    //Create Readable datestamp
        const now = new Date();
        const dateTimeStamp = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

    
    // Create XML document
    const xmlDoc = document.implementation.createDocument(null, "CabinetXML");
    const root = xmlDoc.documentElement;
    root.setAttribute("type", "Cabinet");
    
    // Add metadata
    const metadata = xmlDoc.createElement("Metadata");
    metadata.setAttribute("originalFile", originalFileName || "unknown.bpt");
    metadata.setAttribute("exportDate", new Date().toISOString());
    metadata.setAttribute("unit", parsedData.unit || "Unknown");
    metadata.setAttribute("groupName", group.name || "");
    metadata.setAttribute("groupIndex", groupIndex);
    root.appendChild(metadata);
    
    // Create cabinet element
    const cabinetKey = `${groupIndex}-${cabinetIndex}`;
    const cabinetElement = xmlDoc.createElement("Cabinet");
    cabinetElement.setAttribute("index", cabinetIndex);
    cabinetElement.setAttribute("name", cabinet.name || "");
    cabinetElement.setAttribute("cabinetType", cabinet.cabinetType || "");
    cabinetElement.setAttribute("bypassed", bypassLimits[cabinetKey] ? "true" : "false");
    
    // Add all cabinet metadata
    cabinetElement.setAttribute("installationType", cabinet.installationType || "");
    cabinetElement.setAttribute("verticalAngle", cabinet.verticalAngle || "");
    cabinetElement.setAttribute("horizontalAngle", cabinet.horizontalAngle || "");
    cabinetElement.setAttribute("bottomArrayPoint", cabinet.bottomArrayPoint || "");
    cabinetElement.setAttribute("frontLoad", cabinet.frontLoad || "");
    cabinetElement.setAttribute("rearLoad", cabinet.rearLoad || "");
    cabinetElement.setAttribute("hangingType", cabinet.hangingType || "");
    cabinetElement.setAttribute("frameName", cabinet.frameName || "");
    cabinetElement.setAttribute("reference1", cabinet.reference1 || "");
    cabinetElement.setAttribute("reference2", cabinet.reference2 || "");
    
    // Add columns
    cabinet.columns.forEach((column, colIndex) => {
        const columnElement = xmlDoc.createElement("Column");
        columnElement.setAttribute("index", colIndex);
        columnElement.setAttribute("name", column.name || "");
        
        // Add boxes in column
        column.boxes.forEach((box, boxIndex) => {
            const boxElement = createBoxElement(xmlDoc, box, boxIndex);
            columnElement.appendChild(boxElement);
        });
        
        cabinetElement.appendChild(columnElement);
    });
    
    // Add direct boxes
    cabinet.boxes.forEach((box, boxIndex) => {
        const boxElement = createBoxElement(xmlDoc, box, boxIndex);
        boxElement.setAttribute("isDirect", "true");
        cabinetElement.appendChild(boxElement);
    });
    
    root.appendChild(cabinetElement);
    
    // Serialize XML
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    
    // Format XML with indentation
    const formattedXml = formatXml(xmlString);
    
    // Download
    const blob = new Blob([formattedXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cabinetName = cabinet.name ? cabinet.name.replace(/[^a-z0-9]/gi, '_') : 'cabinet';
    a.download = `${cabinetName}_cabinet_${dateTimeStamp}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    //alert('Cabinet XML exported successfully!');
}*/

