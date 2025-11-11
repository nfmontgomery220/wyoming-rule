"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 2020 Census data for key states
const stateData = {
  Wyoming: { population: 576851, currentSeats: 1, partisan: "R" },
  Texas: { population: 29145505, currentSeats: 38, partisan: "R" },
  California: { population: 39538223, currentSeats: 52, partisan: "D" },
  Florida: { population: 21538187, currentSeats: 28, partisan: "R" },
  "New York": { population: 20201249, currentSeats: 26, partisan: "D" },
  Pennsylvania: { population: 13002700, currentSeats: 17, partisan: "Swing" },
  Illinois: { population: 12812508, currentSeats: 17, partisan: "D" },
  Ohio: { population: 11799448, currentSeats: 15, partisan: "R" },
  Georgia: { population: 10711908, currentSeats: 14, partisan: "Swing" },
  "North Carolina": { population: 10439388, currentSeats: 14, partisan: "R" },
  Michigan: { population: 10037261, currentSeats: 13, partisan: "Swing" },
  Arizona: { population: 7151502, currentSeats: 9, partisan: "Swing" },
  Wisconsin: { population: 5893718, currentSeats: 8, partisan: "Swing" },
  Virginia: { population: 8631393, currentSeats: 11, partisan: "D" },
  Nevada: { population: 3104614, currentSeats: 4, partisan: "Swing" },
}

export default function WyomingRuleCalculator() {
  const [wyomingPop, setWyomingPop] = useState(576851)

  const calculations = useMemo(() => {
    const results = Object.entries(stateData).map(([state, data]) => {
      const wyomingRuleSeats = Math.round(data.population / wyomingPop)
      const seatChange = wyomingRuleSeats - data.currentSeats
      const currentEC = data.currentSeats + 2 // House + Senate
      const wyomingRuleEC = wyomingRuleSeats + 2
      const ecChange = wyomingRuleEC - currentEC

      return {
        state,
        ...data,
        wyomingRuleSeats,
        seatChange,
        currentEC,
        wyomingRuleEC,
        ecChange,
        peoplePerSeat: Math.round(data.population / wyomingRuleSeats),
      }
    })

    const totalCurrentSeats = results.reduce((sum, r) => sum + r.currentSeats, 0)
    const totalWyomingSeats = results.reduce((sum, r) => sum + r.wyomingRuleSeats, 0)
    const totalSeatChange = totalWyomingSeats - totalCurrentSeats

    // Partisan analysis
    const republicanGains = results
      .filter((r) => r.partisan === "R")
      .reduce((sum, r) => sum + Math.max(0, r.seatChange), 0)
    const democraticGains = results
      .filter((r) => r.partisan === "D")
      .reduce((sum, r) => sum + Math.max(0, r.seatChange), 0)
    const swingGains = results
      .filter((r) => r.partisan === "Swing")
      .reduce((sum, r) => sum + Math.max(0, r.seatChange), 0)

    // Electoral College totals - corrected calculation
    const currentTotalEC = 538 // Current: 435 House + 100 Senate + 3 DC

    // For Wyoming Rule, we need to estimate total House seats for all 50 states
    // Using 2020 total US population: ~331.4 million
    const totalUSPopulation = 331449281
    const estimatedTotalHouseSeats = Math.round(totalUSPopulation / wyomingPop)
    const wyomingRuleTotalEC = estimatedTotalHouseSeats + 100 + 3 // House + Senate + DC

    const currentMajority = 270 // Fixed at 270
    const wyomingRuleMajority = Math.floor(wyomingRuleTotalEC / 2) + 1

    return {
      results: results.sort((a, b) => Math.abs(b.seatChange) - Math.abs(a.seatChange)),
      totalCurrentSeats,
      totalWyomingSeats,
      totalSeatChange,
      republicanGains,
      democraticGains,
      swingGains,
      currentTotalEC,
      wyomingRuleTotalEC,
      currentMajority,
      wyomingRuleMajority,
    }
  }, [wyomingPop])

  const texasAnalysis = calculations.results.find((r) => r.state === "Texas")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Wyoming Rule Calculator</h1>
        <p className="text-muted-foreground">
          Analyzing the impact of the Wyoming Rule on representation and electoral politics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Adjust Wyoming's population to see different scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="wyoming-pop">Wyoming Population</Label>
            <Input
              id="wyoming-pop"
              type="number"
              value={wyomingPop}
              onChange={(e) => setWyomingPop(Number(e.target.value))}
              className="w-48"
            />
            <p className="text-sm text-muted-foreground">Current: 576,851 (2020 Census)</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="texas">Texas Focus</TabsTrigger>
          <TabsTrigger value="electoral">Electoral College</TabsTrigger>
          <TabsTrigger value="partisan">Partisan Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total House Seats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculations.totalCurrentSeats} → {calculations.totalWyomingSeats}
                </div>
                <p className="text-sm text-muted-foreground">Change: +{calculations.totalSeatChange} seats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">People per District</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">~{wyomingPop.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Standardized across all states</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Representation Equity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Perfect</div>
                <p className="text-sm text-muted-foreground">Equal representation ratio</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>State-by-State Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">State</th>
                      <th className="text-right p-2">Current Seats</th>
                      <th className="text-right p-2">Wyoming Rule</th>
                      <th className="text-right p-2">Change</th>
                      <th className="text-right p-2">People/Seat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.results.map((result) => (
                      <tr key={result.state} className="border-b">
                        <td className="p-2 font-medium">{result.state}</td>
                        <td className="text-right p-2">{result.currentSeats}</td>
                        <td className="text-right p-2">{result.wyomingRuleSeats}</td>
                        <td
                          className={`text-right p-2 font-medium ${
                            result.seatChange > 0
                              ? "text-green-600"
                              : result.seatChange < 0
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {result.seatChange > 0 ? "+" : ""}
                          {result.seatChange}
                        </td>
                        <td className="text-right p-2">{result.peoplePerSeat.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="texas" className="space-y-4">
          {texasAnalysis && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Texas Representation</CardTitle>
                    <CardDescription>Impact of Wyoming Rule on Texas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {texasAnalysis.currentSeats} → {texasAnalysis.wyomingRuleSeats}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Change: {texasAnalysis.seatChange > 0 ? "+" : ""}
                        {texasAnalysis.seatChange} seats
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <strong>Current people per seat:</strong>{" "}
                        {Math.round(texasAnalysis.population / texasAnalysis.currentSeats).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <strong>Wyoming Rule people per seat:</strong> {texasAnalysis.peoplePerSeat.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Anti-Gerrymandering Impact</CardTitle>
                    <CardDescription>How more districts help</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>More districts = Harder to gerrymander</strong>
                      </p>
                      <p>• {Math.abs(texasAnalysis.seatChange)} additional districts to draw</p>
                      <p>• Smaller, more compact districts</p>
                      <p>• Reduced ability to "pack" and "crack"</p>
                      <p>• Federal mandate overrides state control</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Strategic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p>
                      <strong>Federal Counter to State Gerrymandering:</strong> The Wyoming Rule provides a federal
                      solution that bypasses state-level partisan redistricting. Texas would gain{" "}
                      {Math.abs(texasAnalysis.seatChange)}
                      seats, but the standardized district size makes extreme gerrymandering much more difficult.
                    </p>
                    <p>
                      <strong>Mathematical Constraint:</strong> With {texasAnalysis.wyomingRuleSeats} districts instead
                      of {texasAnalysis.currentSeats}, each district becomes smaller and more geographically
                      constrained, limiting the ability to create bizarre shapes that pack or crack voters.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="electoral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Electoral College Impact</CardTitle>
              <CardDescription>How the Wyoming Rule changes presidential elections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">State</th>
                      <th className="text-right p-2">Current EC</th>
                      <th className="text-right p-2">Wyoming Rule EC</th>
                      <th className="text-right p-2">Change</th>
                      <th className="text-center p-2">Lean</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.results
                      .filter((r) => r.ecChange !== 0)
                      .map((result) => (
                        <tr key={result.state} className="border-b">
                          <td className="p-2 font-medium">{result.state}</td>
                          <td className="text-right p-2">{result.currentEC}</td>
                          <td className="text-right p-2">{result.wyomingRuleEC}</td>
                          <td
                            className={`text-right p-2 font-medium ${
                              result.ecChange > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.ecChange > 0 ? "+" : ""}
                            {result.ecChange}
                          </td>
                          <td className="text-center p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                result.partisan === "R"
                                  ? "bg-red-100 text-red-800"
                                  : result.partisan === "D"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {result.partisan}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">270 / 538</div>
                <p className="text-sm text-muted-foreground">Votes needed to win</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Wyoming Rule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculations.wyomingRuleMajority} / {calculations.wyomingRuleTotalEC}
                </div>
                <p className="text-sm text-muted-foreground">Votes needed to win</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partisan" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-600">Republican Gains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{calculations.republicanGains}</div>
                <p className="text-sm text-muted-foreground">Additional seats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600">Democratic Gains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{calculations.democraticGains}</div>
                <p className="text-sm text-muted-foreground">Additional seats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-600">Swing State Gains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{calculations.swingGains}</div>
                <p className="text-sm text-muted-foreground">Additional seats</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Implications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none space-y-3">
                <p>
                  <strong>Net Effect:</strong> The Wyoming Rule appears relatively balanced in partisan terms, with both
                  parties gaining seats roughly proportional to their population bases.
                </p>
                <p>
                  <strong>Swing State Advantage:</strong> Competitive states gain {calculations.swingGains} seats,
                  potentially making them even more crucial in presidential elections.
                </p>
                <p>
                  <strong>Anti-Gerrymandering Benefit:</strong> The real advantage isn't partisan—it's structural. More,
                  smaller districts make extreme gerrymandering mathematically harder regardless of party.
                </p>
                <p>
                  <strong>Federal Override:</strong> This provides a federal solution that bypasses state-level partisan
                  redistricting entirely, creating a level playing field.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
