from product import pop_products
from production_order import pop_production_order
from production_line import pop_production_line
from line_capacity import pop_line_capacity
from line_station import pop_line_station
from production_plan import pop_production_plan
from user import pop_user
from production_defect import pop_production_defect
import time



def main():

    print("=========== Inserindo produtos ===========")
    pop_products()
    time.sleep(1)

    print("=========== Inserindo pedidos ===========")
    pop_production_order()
    time.sleep(1)

    print("=========== Inserindo linhas de produção ===========")
    pop_production_line()
    time.sleep(1)

    print("=========== Inserindo capacidades de linha ===========")
    pop_line_capacity()
    time.sleep(1)

    print("=========== Inserindo estações ===========")
    pop_line_station()
    time.sleep(1)

    print("=========== Inserindo planos ===========")
    pop_production_plan()
    time.sleep(1)

    print("=========== Inserindo usuários ===========")
    pop_user()
    time.sleep(1)

    print("=========== Inserindo defeitos ===========")
    pop_production_defect()
    time.sleep(1)


if __name__ == '__main__':
    main()