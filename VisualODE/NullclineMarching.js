
		let nClineWidth = (fieldWidth)/nClineRes;
		
		
		for (let gridId = 0; gridId < nClineVecs.length;gridId++){
			let curPos = coordinateToPixel(nClineVecs[gridId]);
			let curDiff = coordinateToPixel(nClineDifs[gridId]);
			//fill([math.sign(curDiff.y)*255,255*math.sign(curDiff.x),150]); 
			//fill([-dxPosi[nullX]*255,255*dyPosi[nullX],150])
			//noStroke();
			//stroke(255,0,0);
			//circle(curPos.x,curPos.y,10)
			
			push()
			translate(curPos.x,curPos.y)
			//nClineRes
			
			
			//fill(150+100*dyPosi[gridId])
			//circle(curPos.x,curPos.y,3)
			//text(gridPos[nullX],curPos.x+nClineWidth-3,curPos.y-nClineWidth)
			//circle(0,0,3);
			//text(gridPos[nullX],nClineWidth-3,-nClineWidth)
			
			//let curHeight = coordinateToPixel(nClineVecs[gridId+nClineRes])
			
			// Calculate the positions line should start and stop from
			leftPos = createVector(0,-nClineWidth); 
			rightPos = createVector(2*nClineWidth,-nClineWidth); 
			upPos = createVector(nClineWidth,-2*nClineWidth); 
			downPos = createVector(nClineWidth,0); 
			
			stroke(xNullclineColor)
			switch (gridPos[gridId]) {
				case (1):
					line(leftPos.x,leftPos.y,downPos.x,downPos.y)
					break;
				case (14): // Same as 1
					line(leftPos.x,leftPos.y,downPos.x,downPos.y)
					break;
					
				case (2):
					line(downPos.x,downPos.y,rightPos.x,rightPos.y)
					break;
				case (13): // Same as 2
					line(downPos.x,downPos.y,rightPos.x,rightPos.y)
					break;
					
				case (3):
					line(leftPos.x,leftPos.y,rightPos.x,rightPos.y)
					break;
				case (12): // Same as 3
					line(leftPos.x,leftPos.y,rightPos.x,rightPos.y)
					break;
					
				case (4):
					line(upPos.x,upPos.y,rightPos.x,rightPos.y)
					break;
				case (11): // Same as 4
					line(upPos.x,upPos.y,rightPos.x,rightPos.y)
					break;
					
				case (5): // Saddle...
					line(upPos.x,upPos.y,leftPos.x,leftPos.y)
					line(downPos.x,downPos.y,rightPos.x,rightPos.y)
					break;
					
				case (10): // Saddle...
					line(upPos.x,upPos.y,rightPos.x,rightPos.y)
					line(leftPos.x,leftPos.y,downPos.x,downPos.y)
					break;
					
				case (6):
					line(upPos.x,upPos.y,downPos.x,downPos.y)
					break;
				case (9): // Same as 6
					line(upPos.x,upPos.y,downPos.x,downPos.y)
					break;
					
				case (7):
					line(upPos.x,upPos.y,leftPos.x,leftPos.y)
					break;
				case (8): // Same as 7
					line(upPos.x,upPos.y,leftPos.x,leftPos.y)
					break;
					
				case (15):
				
					break;
				default:
			} 
			
			stroke(yNullclineColor)
			switch (gridPosY[gridId]) {
				case (1):
					line(leftPos.x,leftPos.y,downPos.x,downPos.y)
					break;
				case (14): // Same as 1
					line(leftPos.x,leftPos.y,downPos.x,downPos.y)
					break;
					
				case (2):
					line(downPos.x,downPos.y,rightPos.x,rightPos.y)
					break;
				case (13): // Same as 2
					line(downPos.x,downPos.y,rightPos.x,rightPos.y)
					break;
					
				case (3):
					line(leftPos.x,leftPos.y,rightPos.x,rightPos.y)
					break;
				case (12): // Same as 3
					line(leftPos.x,leftPos.y,rightPos.x,rightPos.y)
					break;
					
				case (4):
					line(upPos.x,upPos.y,rightPos.x,rightPos.y)
					break;
				case (11): // Same as 4
					line(upPos.x,upPos.y,rightPos.x,rightPos.y)
					break;
					
				case (5): // Saddle...
					line(upPos.x,upPos.y,leftPos.x,leftPos.y)
					line(downPos.x,downPos.y,rightPos.x,rightPos.y)
					break;
					
				case (10): // Saddle...
					line(upPos.x,upPos.y,rightPos.x,rightPos.y)
					line(leftPos.x,leftPos.y,downPos.x,downPos.y)
					break;
					
				case (6):
					line(upPos.x,upPos.y,downPos.x,downPos.y)
					break;
				case (9): // Same as 6
					line(upPos.x,upPos.y,downPos.x,downPos.y)
					break;
					
				case (7):
					line(upPos.x,upPos.y,leftPos.x,leftPos.y)
					break;
				case (8): // Same as 7
					line(upPos.x,upPos.y,leftPos.x,leftPos.y)
					break;
					
				case (15):
				
					break;
				default:
			} 
			
			pop()
		}
		/* 
		
		for (let k = 0; k < nClineRes;k++){
			for (let j = 0; j < nClineRes;j++){
				//if dXPosi
				
				let curGrid = 0;
				
				if (k < nClineRes-1){
					curGrid = dxPosi[curID];
				}
				gridPos.push(curGrid);
				
				curID = curID+1;
			}
		}
		
		*/
		
		
		/*
		for (let nullX = 1; nullX < xSignChange.length;nullX++){
			let curPos = coordinateToPixel(xSignChange[nullX]);
			fill(xNullclineColor); 
			noStroke();
			//stroke(255,0,0);
			circle(curPos.x,curPos.y,1)
		}
		for (let nullY = 1; nullY < ySignChange.length;nullY++){
			let curPos = coordinateToPixel(ySignChange[nullY]);
			fill(yNullclineColor);
			noStroke();
			//stroke(255,0,255);
			circle(curPos.x,curPos.y,1)
		}
		
		*/