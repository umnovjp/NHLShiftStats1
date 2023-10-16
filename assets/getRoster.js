for (j = 0; j < 3; j++) { if (fiveOnFive[i][j].length === 0) { tempArray8.push(fiveOnFive[i][j+3]) }
                    else if (fiveOnFive[i][j+3].length === 0) { tempArray8.push(fiveOnFive[i][j]) }
                    else if ((fiveOnFive[i][j].length > 0) && (fiveOnFive[i][j + 3].length > 0)) { 
                    if (fiveOnFive[i][j][0] === 0) { tempArray8[j] = fiveOnFive[i][j].concat(fiveOnFive[i][j + 3]) } 
                    else if (fiveOnFive[i][j + 3][0] === 0) { tempArray8[j] = fiveOnFive[i][j + 3].concat(fiveOnFive[i][j])
                  }
                }
                  for (k = 0; k < tempArray8[j].length/2 - 1; k++) {if (tempArray8[j][2*k+1] === tempArray8[j][2*k+2]){tempArray9 = tempArray8[j].splice(2*k+1, 2)}
                    }
                } // end j loop period goalies changes loop