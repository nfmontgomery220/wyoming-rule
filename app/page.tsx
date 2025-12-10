"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

// 2020 Census data (approximations for key states)
const stateData = [
  { state: "California", population: 39538223, currentSeats: 52 },
  { state: "Texas", population: 29145505, currentSeats: 38 },
  { state: "Florida", population: 21538187, currentSeats: 28 },
  { state: "New York", population: 20201249, currentSeats: 26 },
  { state: "Pennsylvania", population: 13002700, currentSeats: 17 },
  { state: "Illinois", population: 12812508, currentSeats: 17 },
  { state: "Ohio", population: 11799448, currentSeats: 15 },
  { state: "Georgia", population: 10711908, currentSeats: 14 },
  { state: "North Carolina", population: 10439388, currentSeats: 14 },
  { state: "Michigan", population: 10077331, currentSeats: 13 },
  { state: "Wyoming", population: 576851, currentSeats: 1 },
]

const WYOMING_POPULATION = 576851
const CURRENT_HOUSE_SIZE = 435
const CURRENT_AVG_DISTRICT = Math.round(331449281 / CURRENT_HOUSE_SIZE) // US population / 435

export default function WyomingRulePage() {
  const [showAll, setShowAll] = useState(false)

  // Calculate Wyoming Rule seats
  const wyomingRuleData = stateData.map((state) => {
    const wyomingSeats = Math.round(state.population / WYOMING_POPULATION)
    const seatChange = wyomingSeats - state.currentSeats
    return {
      ...state,
      wyomingSeats,
      seatChange,
      percentChange: ((seatChange / state.currentSeats) * 100).toFixed(1),
    }
  })

  const totalWyomingSeats = Math.round(331449281 / WYOMING_POPULATION)

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">The Wyoming Rule</h1>
          <p className="text-lg text-muted-foreground text-balance max-w-3xl mx-auto">
            An analysis of resizing the House of Representatives by setting district size to Wyoming's population—and
            its impact on gerrymandering.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Current System</CardTitle>
              <CardDescription>Fixed at 435 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{CURRENT_HOUSE_SIZE}</div>
                <div className="text-sm text-muted-foreground">
                  ~{(CURRENT_AVG_DISTRICT / 1000).toFixed(0)}K people per district
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Wyoming Rule</CardTitle>
              <CardDescription>Based on smallest state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{totalWyomingSeats}</div>
                <div className="text-sm text-muted-foreground">
                  ~{(WYOMING_POPULATION / 1000).toFixed(0)}K people per district
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Difference</CardTitle>
              <CardDescription>Additional seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">+{totalWyomingSeats - CURRENT_HOUSE_SIZE}</div>
                <div className="text-sm text-muted-foreground">
                  {(((totalWyomingSeats - CURRENT_HOUSE_SIZE) / CURRENT_HOUSE_SIZE) * 100).toFixed(0)}% increase
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gerrymandering Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Impact on Gerrymandering</CardTitle>
            <CardDescription>Why the Wyoming Rule matters for current redistricting efforts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Smaller, More Compact Districts</h4>
                  <p className="text-sm text-muted-foreground">
                    Districts would shrink from ~750K to ~577K people, making bizarre shapes harder to justify and
                    creating more natural community boundaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Increased Proportional Representation</h4>
                  <p className="text-sm text-muted-foreground">
                    With 32% more seats, minority communities and political groups have better chances of fair
                    representation without extreme district manipulation.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Renders Current Gerrymanders Obsolete</h4>
                  <p className="text-sm text-muted-foreground">
                    Existing gerrymandered maps would need complete redrawing, potentially disrupting carefully crafted
                    partisan advantages and forcing fairer redistricting.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>State-by-State Comparison</CardTitle>
            <CardDescription>How representation would change under the Wyoming Rule</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Population</TableHead>
                  <TableHead className="text-right">Current Seats</TableHead>
                  <TableHead className="text-right">Wyoming Rule</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wyomingRuleData.map((state) => (
                  <TableRow key={state.state}>
                    <TableCell className="font-medium">{state.state}</TableCell>
                    <TableCell className="text-right">{state.population.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{state.currentSeats}</TableCell>
                    <TableCell className="text-right font-semibold">{state.wyomingSeats}</TableCell>
                    <TableCell className="text-right">
                      <span className={state.seatChange > 0 ? "text-green-600 font-semibold" : ""}>
                        {state.seatChange > 0 ? "+" : ""}
                        {state.seatChange}
                        <span className="text-muted-foreground ml-1 text-xs">({state.percentChange}%)</span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Context */}
        <Card>
          <CardHeader>
            <CardTitle>Current Relevance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              With redistricting efforts currently underway across the country, the Wyoming Rule presents a compelling
              alternative to the status quo. Each current district contains approximately 750,000 people, creating large
              geographic areas that are susceptible to partisan manipulation.
            </p>
            <p>
              By adopting the Wyoming Rule—or similar legislation—Congress could fundamentally reshape representation in
              a way that makes gerrymandering far more difficult. The increased granularity of smaller districts would
              better reflect actual communities and reduce the effectiveness of sophisticated redistricting algorithms
              designed to maximize partisan advantage.
            </p>
            <p className="font-semibold text-foreground">
              In essence, the Wyoming Rule could render current state-level gerrymandering efforts moot by requiring
              complete remapping with a fundamentally different district size—potentially creating a rare opportunity
              for fairer redistricting practices.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
