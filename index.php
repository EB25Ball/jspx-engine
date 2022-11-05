<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        body{
            margin: 0;
            display: grid;
            place-content: center;
        } 
        .constainer{
            width: 100%;
            height: 100%;
        }
        ul{
            margin-inline: auto;
        }
    </style>
    <title>jspx-engine</title>
</head>
<body>
    <div class="container">
        <ul>
            <?php
                $dir = 'versions/';
                $arr = scandir($dir);
                for ($i = 2; $i < count($arr); $i++) {
                    echo '<li><a href="versions/'.$arr[$i].'">'.substr($arr[$i], 0, 3).'</a></li>';
                }
            ?>
        </ul>
    </div>
</body>
</html>