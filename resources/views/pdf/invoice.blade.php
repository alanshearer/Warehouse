<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
            .page-break {
                page-break-after: always;
            }
        </style>
    </head>
    <body>
        {{ $data }}
        <h1>Page 1</h1>
        <table>
            <tr>
                <td style="background: red;">1</td><td>2</td><td>3</td><td>4</td>
                <td>1</td><td>2</td><td>3</td><td>4</td>
                <td>1</td><td>2</td><td>3</td><td>4</td>
            </tr>
        </table>
        <div class="page-break"></div>
        <h1>Page 2</h1>
    </body>
</html>