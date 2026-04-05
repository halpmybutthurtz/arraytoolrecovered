#Adamson ArrayTool

Tool for importing .bpt files (tested up to 1.3.8) to view loudspeaker metadata, toggle stack pin configurations, and assign cabling per cabinet. Export to XML for future editing or to share with others.

##Features
- Supports all active, E, and S series line arrays and subwoofers.
- Meta data shows all current data from user sheet, plus span and spacing for sub arrays
- Subs indicate front or rear
- Stack pins must be toggled by the user. Toggled Stack pins will be saved in XML files
- Power/Data/Analog cabling assignment in color groups and numbered for cabling order
- Hybrid option to set all current row to the same color group
- Hotkeys 1-9 for color selection
- NL8/NL4 column only for E/S series
- Cable assignments can be cleared with the Clear Assignment button in each Loudspeaker section
- Cable limits can be set by "line voltage" and "switch hop" selections under the Metadata header of each Loudspeaker
- Cable limits can be bypassed using the Bypass button in each Loudspeaker Section
- Frame and Beam orientation can be viewed as a popup with the "Eye" icon

##Save formats
- A master XML can be saved (yellow save button top right) which will contain the stack pin toggle and cable assignment information, which can be loaded to continue work later
- Each array can be exported as a "Loudspeaker XML" individually (gray save button in each Loudspeaker Array)
    - Only one may be loaded at a time
    - It will be loaded in a read-only state
- Both XML file types can be loaded from the "load XML" button at the top


###.bpt and Master XML are optimized for desktop but useable on mobile. Loudspeaker XML view is pretty optimized for mobile.

##Future features
- Loom mode to automatically assign cabing based on user defined cable limits
- Improved logic for passive cabinets to support pin rotations, whether via cable or cabinet connectors
- More colors - some UI element to support dual colors per circuit
- Hole position for single point hangs
- Stage at height
