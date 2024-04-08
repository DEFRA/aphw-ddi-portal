Feature: Edit dog details

    Scenario: Search a dog
        Given I open the url "/"
        When I click on the link "Search dog index"
        And I set "Bravo" to the inputfield "#searchTerms"
        And I press "Enter"
        Then I expect that element "html" contains the text "1 dog record"

    Scenario: Select a dog
        When I click on the link containing "ED30"
        Then I expect that element "h1" contains the text "Dog ED30"
        And I expect that element "(//dd)[1]" contains the text "Bravo"

    Scenario: Click edit dog details
        When I click on the element "(//a[contains(text(),'Edit details')])[1]"
        Then I expect that element "h1" contains the text "Edit dog details"

    Scenario: Dog details updated successfully
        When I set "White" to the inputfield "#colour"
        And I select the option with the value "Male" for element "#sex"
        And I set "01" to the inputfield "#dateOfBirth-day"
        And I set "02" to the inputfield "#dateOfBirth-month"
        And I set "2022" to the inputfield "#dateOfBirth-year"
        And I set "RG4587GH" to the inputfield "#tattoo"
        And I set "852638526311111" to the inputfield "#microchipNumber"
        And I set "852638526322222" to the inputfield "#microchipNumber2"
        And I click on the element "button=Save details"
        Then I expect that element "h1" contains the text "Dog ED30"
        And I expect that element "(//dd)[1]" contains the text "Bravo"
        And I expect that element "(//dd)[2]" contains the text "Pit Bull Terrier"
        And I expect that element "(//dd)[3]" contains the text "White"
        And I expect that element "(//dd)[4]" contains the text "Male"
        And I expect that element "(//dd)[5]" contains the text "01 February 2022"   
        And I expect that element "(//dd)[6]" contains the text "RG4587GH" 
        And I expect that element "(//dd)[7]" contains the text "852638526311111" 
        And I expect that element "(//dd)[8]" contains the text "852638526322222"    
              