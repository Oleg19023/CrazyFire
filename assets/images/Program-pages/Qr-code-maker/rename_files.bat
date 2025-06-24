@echo off
setlocal enabledelayedexpansion

rem Расширения, которые нужно обрабатывать
set extensions=png jpg mp4

rem Список всех подходящих файлов
set /a counter=1
set tempList=__filelist.txt
del "%tempList%" >nul 2>&1

rem Собрать все подходящие файлы в список
for %%E in (%extensions%) do (
    for %%F in (*.%%E) do echo %%F>>"%tempList%"
)

rem Переименование через временные имена, чтобы избежать конфликтов
for /f "delims=" %%F in ('type "%tempList%"') do (
    ren "%%F" "tmp_!counter!%%~xF"
    set /a counter+=1
)

rem Вторая фаза — нумерация по порядку
set /a counter=1
for %%F in (tmp_*) do (
    set "ext=%%~xF"
    ren "%%F" "!counter!%%~xF"
    set /a counter+=1
)

del "%tempList%"
echo Готово.
pause
