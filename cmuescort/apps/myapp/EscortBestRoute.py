# define a function to transform data to the desired form
def transDataForm(d):
    desiredData = {}
    for item in d:
        for key in item.keys():
            vertexes = key.split('-')
            if vertexes[0] != 'startStation':
                desiredData[key] = item[key]
                updatekey = vertexes[1] + '-' + vertexes[0]
                desiredData[updatekey] = item[key]
            elif vertexes[1]!= 'destStation':
                desiredData[key] = item[key]
    return desiredData


################ The best route selection ################
# naive best route alogrithm only consider min-distance
# and when the weight of two edges are the same
# the algorithm will randomly pick one and continue

# define class Vertex which contains
#   1. the start vertex(itself)
#   2. neighbors which is a list contains all the instances that
#      could be the neighbor of this vertex
#   3. weights which is a list contains all the weights(distance) of the edges
#      between the start vertex and its neighbor
class Vertex(object):
    def __init__(self,start,neighbors = [],weights = []):
        self.start = start
        self.neighbors = neighbors
        self.weights = weights

    # check if the neighbour is legal
    def islegalNeighbor(self, targNeighbor):
        return targNeighbor in self.neighbors

    # search for the legally available and nearest neigbour
    def searchForNearestNeigbour(self):
        availableNeigbor = []
        correspondingWeights = []
        for neighbor in self.neighbors:
            if self.islegalNeighbor(neighbor):
                    availableNeigbor.append(neighbor)
                    correspondingWeight = self.weights[self.neighbors.index(neighbor)]
                    correspondingWeights.append(correspondingWeight)
        minWeight = min(correspondingWeights)
        self.conNeighbor = (self.neighbors[self.weights.index(minWeight)].start,minWeight)
        return self.neighbors[self.weights.index(minWeight)]

# helper functions

# define a global variable to store all the riders' andrewID
# also the first and last elements of this list are repsectively
# 'starStation' and 'destStation'
riderList = []
vertexList = []
# create a rider list
# the list will be deployed to check if
# it is the time to connect the destStation
def createRiderList(verAndEdges):
    for key in verAndEdges.keys():
        vertexes = key.split("-")
        for vertex in vertexes:
            if vertex not in riderList:
                riderList.append(vertex)

# initialize vertex instances
def initVertex(verAndEdges):
    # define vertex instances
    for i in range(len(riderList)):
        vertexList.append(Vertex(riderList[i]))

    # assign neigbors and weights
    for vertex1 in vertexList:
        neighbors = []
        weights = []
        for key in verAndEdges.keys():
            startsAndNeighbor = key.split("-")
            if vertex1.start == startsAndNeighbor[0] and \
            vertex1.start != startsAndNeighbor[1]:
                for vertex2 in vertexList:
                    if vertex2.start == startsAndNeighbor[1]:
                        neighbors.append(vertex2)
                        weights.append(verAndEdges[key])

        vertex1.neighbors = neighbors
        vertex1.weights = weights

# main function
def bestRouteSearch():
    for vertex in vertexList:
        if vertex.start == 'startStation':
            return search(vertex)
    return None

# recursively search for the best route
def search(startVertex):
    if riderList == ['destStation']:  # base case
        return 'destStation'
#  the neighbors can contain the previous visited vertexes
    elif riderList != ['destStation'] and \
         startVertex.start  == "destStation":
        return None
#  one way connection
    elif startVertex.start not in riderList:
        return None
    else:
        # backtracking
        while(1):
            riderList.remove(startVertex.start)
            connect = startVertex.searchForNearestNeigbour()
            result = search(connect)
            if result!=None:
                return startVertex.start + "-" + result
            else:
                startVertex.neighbors.remove(connect)
                riderList.append(startVertex.start)


# helper function to get nearest neigbour
# without destStation
def getNeigborWithoutDest(vertex):
    updateWeights = []
    for i in range(len(vertex.neighbors)):
        if vertex.neighbors[i].start != 'destStation':
            updateWeights.append(vertex.weights[i])

    return vertex.weights.index(min(updateWeights))


def bestRouteWrapperFunction(routeInfo):
    createRiderList(routeInfo)
    initVertex(routeInfo)
    return bestRouteSearch()