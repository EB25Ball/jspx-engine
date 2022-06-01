<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>jspx-engine</title>
</head>
<body>
    <canvas id="render"></canvas>
    <div class="menu">
        <div id='gravityToggle' onclick='mouseToggle()'>TOGGLE</div>
        <div id="start">START</div>
        <div id="add" onclick='addObject()'>ADD</div>
        <div class="gravity"><span id='gplus' onclick='gravityPlus()'>+</span>GRAVITY<span id='gminus' onclick='gravityMinus()'>-</span></div>
    </div>
    <script type="text/javascript" src="main.js"></script>
</body>
</html>