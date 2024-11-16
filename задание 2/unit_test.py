import unittest
from tkinter import Tk
from calculator import Main  

class TestMain(unittest.TestCase):
    def setUp(self):
        self.root = Tk()
        self.app = Main(self.root)



    def test_addition(self):
        self.app.logicalc("1")
        self.app.logicalc("+")
        self.app.logicalc("1")
        self.app.logicalc("=")
        self.assertEqual(self.app.formula, "2")
        self.assertEqual(self.app.lbl.cget("text"), "2")

    def test_clear(self):
        self.app.logicalc("1")
        self.app.logicalc("C")
        self.assertEqual(self.app.formula, "0")
        self.assertEqual(self.app.lbl.cget("text"), "0")

    def test_delete(self):
        self.app.logicalc("1")
        self.app.logicalc("2")
        self.app.logicalc("DEL")
        self.assertEqual(self.app.formula, "1")
        self.assertEqual(self.app.lbl.cget("text"), "1")

    def test_square(self):
        self.app.logicalc("3")
        self.app.logicalc("X^2")
        self.assertEqual(self.app.formula, "9")
        self.assertEqual(self.app.lbl.cget("text"), "9")

if __name__ == '__main__':
    unittest.main()