import QtQuick 2.15
import QtQuick.Window 2.15
import "logic.js" as Logic

Window {
    id: root
    width: 1400
    height: 900
    visible: true
    title: qsTr("Mine Sweeper")

    Item {
        width: root.width * 0.8
        height: parent.height

        Grid {
            id: gridTable
            anchors.fill: parent
            rows: 10
            columns: 10
            spacing: 5

            property int totalCells: rows * columns
            property int bombCount: Math.floor(totalCells * 0.07)
            property var bombMap: []
            property var revealed: []

            Component.onCompleted: {
                bombMap = Logic.createBombMap(totalCells, bombCount)
                revealed = []
                for (let i = 0; i < totalCells; i++) {
                    revealed.push(false)
                }
            }

            Repeater {
                model: gridTable.totalCells

                Rectangle {
                    id: mineBox
                    width: 50
                    height: 50
                    property int row: Math.floor(index / gridTable.columns)
                    property int col: index % gridTable.columns

                    color: gridTable.revealed.length > index && gridTable.revealed[index] ? "lightgray" : "darkgray"

                    Text {
                        anchors.centerIn: parent
                        font.pixelSize: 24
                        visible: gridTable.revealed.length > index && gridTable.revealed[index]
                        text: gridTable.bombMap[index] === "mine"
                              ? "💣"
                              : Logic.countAdjacentMines(index, gridTable.rows, gridTable.columns, gridTable.bombMap)
                    }

                    MouseArea {
                        anchors.fill: parent
                        onClicked: {
                            Logic.revealRecursive(index, gridTable.rows, gridTable.columns, gridTable.bombMap, gridTable.revealed)
                            gridTable.revealed = gridTable.revealed.slice()
                        }
                    }
                }
            }
        }
    }
}
