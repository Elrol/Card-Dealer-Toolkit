import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "card-dealer-toolkit" is now active!');

    const pathDiagnostics = vscode.languages.createDiagnosticCollection('cardPaths');
    context.subscriptions.push(pathDiagnostics);

    // 1. Text Document Event Listeners
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => validateUriPath(doc.uri, pathDiagnostics)),
        vscode.workspace.onDidSaveTextDocument(doc => validateUriPath(doc.uri, pathDiagnostics)),
        vscode.workspace.onDidCloseTextDocument(doc => pathDiagnostics.delete(doc.uri))
    );

    // 2. File System Watcher
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    context.subscriptions.push(
        watcher.onDidCreate(uri => validateUriPath(uri, pathDiagnostics)),
        watcher.onDidChange(uri => validateUriPath(uri, pathDiagnostics)),
        watcher.onDidDelete(uri => pathDiagnostics.delete(uri)),
        watcher
    );

    context.subscriptions.push(vscode.commands.registerCommand('cardDealer.createNewCard', async (uri) => {
    const folderUri = uri || vscode.workspace.workspaceFolders![0].uri;
    
    const fileName = await vscode.window.showInputBox({ 
        prompt: "Enter new card name" 
    });
    
    if (fileName) {
        const fileUri = vscode.Uri.joinPath(folderUri, `${fileName}.card`);
        
        // Use TextEncoder to convert the string to a Uint8Array
        const contentString = JSON.stringify({
            "gameID": "",
            "setID": "",
            "cardID": "",
            "name": "",
            "cost": 0.0,
            "face": "",
            "frame": "",
            "values": {},
            "effects": []
        }, null, 2);
        
        const content = new TextEncoder().encode(contentString);
        
        await vscode.workspace.fs.writeFile(fileUri, content);
        
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    }}));

    context.subscriptions.push(vscode.commands.registerCommand('cardDealer.createNewPack', async (uri) => {
    const folderUri = uri || vscode.workspace.workspaceFolders![0].uri;
    
    const fileName = await vscode.window.showInputBox({ 
        prompt: "Enter new pack name" 
    });
    
    if (fileName) {
        const fileUri = vscode.Uri.joinPath(folderUri, `${fileName}.pack`);
        
        // Use TextEncoder to convert the string to a Uint8Array
        const contentString = JSON.stringify({
            "gameID": "",
            "setID": "",
            "packID": "",
            "name": "",
            "front": "",
            "back": "",
            "cost": 0.0,
            "yield": 0,
            "color": {
                "red": 0,
                "green": 0,
                "blue": 0
            },
            "contents": [
                {
                    "cardID": "",
                    "weight": 0
                }
            ]
        }, null, 2);
        
        const content = new TextEncoder().encode(contentString);
        
        await vscode.workspace.fs.writeFile(fileUri, content);
        
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    }}));

    context.subscriptions.push(vscode.commands.registerCommand('cardDealer.createNewSet', async (uri) => {
    const folderUri = uri || vscode.workspace.workspaceFolders![0].uri;
    
    const fileName = await vscode.window.showInputBox({ 
        prompt: "Enter new set name" 
    });
    
    if (fileName) {
        const fileUri = vscode.Uri.joinPath(folderUri, `${fileName}.set`);
        
        // Use TextEncoder to convert the string to a Uint8Array
        const contentString = JSON.stringify({
            "gameID": "",
            "setID": "",
            "name": "",
            "icon": "",
            "frame": "",
            "cards": [],
            "packs": []
        }, null, 2);
        
        const content = new TextEncoder().encode(contentString);
        
        await vscode.workspace.fs.writeFile(fileUri, content);
        
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    }}));

    context.subscriptions.push(vscode.commands.registerCommand('cardDealer.createNewGame', async (uri) => {
    const folderUri = uri || vscode.workspace.workspaceFolders![0].uri;
    
    const fileName = await vscode.window.showInputBox({ 
        prompt: "Enter new card game name" 
    });
    
    if (fileName) {
        const fileUri = vscode.Uri.joinPath(folderUri, `${fileName}.game`);
        
        // Use TextEncoder to convert the string to a Uint8Array
        const contentString = JSON.stringify({
            "gameID": "",
            "name": "",
            "icon": "",
            "back": "",
            "sets": [],
            "height": 0.0,
            "width": 0.0,
            "depth": 0.0,
            "cost": 0.0
        }, null, 2);
        
        const content = new TextEncoder().encode(contentString);
        
        await vscode.workspace.fs.writeFile(fileUri, content);
        
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    }}));

    // Run on startup for any currently active window
    if (vscode.window.activeTextEditor) {
        validateUriPath(vscode.window.activeTextEditor.document.uri, pathDiagnostics);
    }
}

function validateUriPath(uri: vscode.Uri, collection: vscode.DiagnosticCollection) {
    const filePath = uri.fsPath;
    const ext = path.extname(filePath).toLowerCase();
    const normalizedPath = filePath.replace(/\\/g, '/'); // Normalize Windows backslashes
    const diagnostics: vscode.Diagnostic[] = [];

    // --- 1. RUNTIME TEXTURE VALIDATION ---
    if (normalizedPath.toLowerCase().includes('/textures/')) {
        const allowedUnrealFormats = ['.png', '.jpg', '.jpeg', '.bmp'];
        
        if (!allowedUnrealFormats.includes(ext)) {
            const message = `Unsupported Runtime Texture: Unreal Engine's runtime texture loader cannot process '${ext}' files. Use .png, .jpg, or .bmp to avoid loading failures.`;
            const range = new vscode.Range(0, 0, 0, 0);
            const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
            diagnostics.push(diagnostic);
            collection.set(uri, diagnostics);
            return;
        }
    }

    // --- 2. GAME DATA FILE VALIDATION ---
    const validExtensions = ['.card', '.set', '.pack', '.game'];
    if (!validExtensions.includes(ext) && !normalizedPath.toLowerCase().includes('/textures/')) { 
        collection.delete(uri);
        return; 
    }

    // Split up the normalized segments
    const pathSegments = normalizedPath.split('/');
    
    // Target keywords we care about checking
    const targetFolders = ['cards', 'sets', 'packs', 'games', 'textures'];

    // To prevent hitting global system folders like 'Content/Packs/', 
    // we only inspect the immediate file containers (the last 3 items in the path: e.g., 'cards', 'first', '0.card')
    const startIdx = Math.max(0, pathSegments.length - 3);
    const localSegments = pathSegments.slice(startIdx);

    for (const segment of localSegments) {
        const lowerSegment = segment.toLowerCase();
        
        // Check if the localized data directory segment violates lowercase rules
        if (targetFolders.includes(lowerSegment) && segment !== lowerSegment) {
            const message = `Folder casing violation: The data directory must be strictly lowercase for cross-platform engine safety. Rename folder '${segment}' to '${lowerSegment}'.`;
            const range = new vscode.Range(0, 0, 0, 1);
            const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
            diagnostics.push(diagnostic);
            break; 
        }
    }

    // Enforce strict structural file boundaries (.set file wandering check)
    if (ext === '.set' && normalizedPath.toLowerCase().includes('/cards/')) {
        const message = `Directory mismatch structure: '.set' expansion files belong inside the 'sets/' folder directory, not 'cards/'.`;
        const range = new vscode.Range(0, 0, 0, 1);
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
        diagnostics.push(diagnostic);
    }

    // Flush the diagnostic list updates
    collection.set(uri, diagnostics);
}

export function deactivate() {}